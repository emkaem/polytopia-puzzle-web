# Unit Sprites

The sprites are downloaded from the official [Polytopia](https://polytopia.io) source.

## Processing

To remove transparent padding and normalize each sprite to a square canvas, [ImageMagick](https://imagemagick.org) is used. Run the following command in PowerShell from this directory:

```powershell
Get-ChildItem *.png | ForEach-Object {
    magick $_.FullName -background none -trim +repage -gravity center -extent '%[fx:max(w,h)]x%[fx:max(w,h)]' $_.FullName
}
```

### What each flag does

| Flag | Description |
|------|-------------|
| `-background none` | Keeps the background transparent during processing |
| `-trim` | Crops away transparent border pixels around the sprite |
| `+repage` | Resets the canvas offset after trimming so coordinates start at `0,0` |
| `-gravity center` | Centers the image when resizing the canvas |
| `-extent '%[fx:max(w,h)]x%[fx:max(w,h)]'` | Expands the canvas to a square using the longest side as both width and height |


