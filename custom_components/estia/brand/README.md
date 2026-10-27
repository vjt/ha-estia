# Brand assets

`icon.svg` is the source. The PNGs are rendered from it and should never be
edited by hand:

```sh
cd custom_components/estia/brand
rsvg-convert -w 256 -h 256 icon.svg -o icon.png
rsvg-convert -w 512 -h 512 icon.svg -o icon@2x.png
```

Home Assistant 2026.3 onwards reads brand images straight out of a custom
integration's own `brand/` directory, and local images take priority over the
brands CDN (<https://developers.home-assistant.io/blog/2026/02/24/brands-proxy-api/>).
This directory is what Home Assistant serves: it ships with the integration.

## The design

Estia (Hestia) is the hearth: a flame on a stone hearth carved with a Greek
key. Flat shapes and few colours, so that at the ~40px of the integrations
list the flame still reads as a flame and the base as stone.
