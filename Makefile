PATH := node_modules/.bin:$(PATH)

src   = src
dest  = build
data  = $(wildcard $(src)/*.dat)
types = identicon identicon-black jdenticon

svg_names = $(foreach s,$(data),$(s:$(src)/%.dat=$(dest)/%-$(t).svg))
svg_files = $(foreach t,$(types),$(svg_names))
png_files = $(svg_files:.svg=.png)

export svg_size = 3750
export png_size = 1500

all: svg png

svg: $(dest) $(svg_files)

png: $(dest) $(png_files)

print-%:
	@echo $($*)

env-%:
	@node -p process.env.$*

$(dest):
	mkdir -p $@

$(dest)/%-identicon.svg: $(src)/%.dat
	node identicon.js $< > $@

$(dest)/%-identicon-white.svg: $(src)/%.dat
	node identicon.js $< '#fff' > $@

$(dest)/%-identicon-black.svg: $(src)/%.dat
	node identicon.js $< '#000' > $@

$(dest)/%-jdenticon.svg: $(src)/%.dat
	node jdenticon.js $< > $@

$(dest)/%.png: $(dest)/%.svg
	svg2png $< --output=$@.tmp
	gm convert -units PixelsPerInch -density 300 $@.tmp -resize $(png_size) $@
	rm -f $@.tmp

.PHONY: all svg png
