Add-Type -AssemblyName System.Runtime.WindowsRuntime
$assemb = [Reflection.Assembly]::LoadWithPartialName("Windows.Media.Ocr")
$null = [Reflection.Assembly]::LoadWithPartialName("Windows.Graphics.Imaging")
$null = [Reflection.Assembly]::LoadWithPartialName("Windows.Storage")

$dir = "C:\Users\Usuario\OneDrive\Escritorio\PIVOT PROJECTS\BOTICA DEL ALMA\fotosprecios"
$files = Get-ChildItem -Path $dir -Filter "*.png"
$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$results = @()
foreach ($f in $files) {
    try {
        $path = $f.FullName
        $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($path).GetAwaiter().GetResult()
        $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $softwareBitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
        $ocrResult = $ocrEngine.RecognizeAsync($softwareBitmap).GetAwaiter().GetResult()
        
        $results += [PSCustomObject]@{
            File = $f.Name
            Text = $ocrResult.Text
        }
        $stream.Close()
    } catch {
        Write-Host "Error en" $f.Name
    }
}
$results | ConvertTo-Json -Depth 3 | Out-File "C:\Users\Usuario\OneDrive\Escritorio\PIVOT PROJECTS\BOTICA DEL ALMA\boticadelalma-ecommerce\ocr_results.json" -Encoding utf8
