Add-Type -AssemblyName System.Drawing

$brainDir = "C:\Users\orati\.gemini\antigravity\brain\3de68291-c152-4f82-9bdd-ccda7bc7182f"
$wsDir = "c:\Users\orati\hardware_gateway_app\hardware\enclosure"

# ==============================================================================
# IMAGE 1: FRONT FACE ELEVATION (SINGLE NATIVE USB-C, SEALED COM PORT)
# ==============================================================================
$w = 1000
$h = 600
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(9, 13, 22))
$g.FillRectangle($bgBrush, 0, 0, $w, $h)

# Grid lines
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 35, 55), 1)
for ($x = 0; $x -lt $w; $x += 40) { $g.DrawLine($gridPen, $x, 0, $x, $h) }
for ($y = 0; $y -lt $h; $y += 40) { $g.DrawLine($gridPen, 0, $y, $w, $y) }

# Fonts & Brushes
$titleFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
$labelFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$microFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 242, 254))
$mintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(85, 214, 190))
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(143, 158, 184))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 82, 82))

$g.DrawString('ESP32-S3 CUSTOM ENCLOSURE - FRONT FACE ELEVATION', $titleFont, $cyanBrush, 50, 35)
$g.DrawString('Single Active Native USB-C Port Cutout - Factory COM / UART Port Sealed Inside Solid PETG Wall', $subFont, $grayBrush, 50, 70)

# Enclosure Outer Front Shell (Main Dark Slate Box)
$caseX = 120
$caseY = 140
$caseW = 760
$caseH = 320
$caseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 38, 60))
$casePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 65, 100), 3)

# Draw Rounded Outer Enclosure Face
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 24
$path.AddArc($caseX, $caseY, $r, $r, 180, 90)
$path.AddArc($caseX + $caseW - $r, $caseY, $r, $r, 270, 90)
$path.AddArc($caseX + $caseW - $r, $caseY + $caseH - $r, $r, $r, 0, 90)
$path.AddArc($caseX, $caseY + $caseH - $r, $r, $r, 90, 90)
$path.CloseFigure()
$g.FillPath($caseBrush, $path)
$g.DrawPath($casePen, $path)

# Lid Seam line across the front
$seamPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 80, 120), 2)
$g.DrawLine($seamPen, $caseX + 10, $caseY + 70, $caseX + $caseW - 10, $caseY + 70)
$g.DrawString("ENCLOSURE LID (SNAP SEAM)", $microFont, $grayBrush, $caseX + 25, $caseY + 50)
$g.DrawString("ENCLOSURE BASE (13.0mm PIN CAVITY)", $microFont, $grayBrush, $caseX + 25, $caseY + 80)

# ------------------------------------------------------------------------------
# LEFT SIDE: NATIVE USB-C CUTOUT (OPEN & ACTIVE)
# ------------------------------------------------------------------------------
$cutX = $caseX + 100
$cutY = $caseY + 110
$cutW = 220
$cutH = 130

# Outer Bevel / Chamfer
$bevelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 25, 40))
$bevelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 242, 254), 2)
$g.FillRectangle($bevelBrush, $cutX, $cutY, $cutW, $cutH)
$g.DrawRectangle($bevelPen, $cutX, $cutY, $cutW, $cutH)

# Hole Opening (Deep Cavity)
$holeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(9, 13, 22))
$g.FillRectangle($holeBrush, $cutX + 12, $cutY + 12, $cutW - 24, $cutH - 24)

# Metal Type-C Female Receptacle Inside
$receptX = $cutX + 28
$receptY = $cutY + 25
$receptW = $cutW - 56
$receptH = $cutH - 50
$metalBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 195, 215))
$metalPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(85, 214, 190), 2)
$g.FillRectangle($metalBrush, $receptX, $receptY, $receptW, $receptH)
$g.DrawRectangle($metalPen, $receptX, $receptY, $receptW, $receptH)

# Center USB-C Tongue / Pin Pill
$tongueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 28, 45))
$g.FillRectangle($tongueBrush, $receptX + 20, $receptY + [int]($receptH/2) - 4, $receptW - 40, 8)

# Active Port Badges
$g.DrawString("NATIVE USB-C", $labelFont, $cyanBrush, $cutX + 45, $cutY + $cutH + 15)
$g.DrawString("ACTIVE GATEWAY OTG PORT", $subFont, $mintBrush, $cutX + 15, $cutY + $cutH + 38)
$g.DrawString("Width: 14.0 mm (Beveled)", $microFont, $grayBrush, $cutX + 35, $cutY + $cutH + 58)

# ------------------------------------------------------------------------------
# RIGHT SIDE: COM / UART PORT (COMPLETELY SEALED BEHIND SOLID PETG WALL)
# ------------------------------------------------------------------------------
$sealX = $caseX + 440
$sealY = $cutY
$sealW = $cutW
$sealH = $cutH

# Solid Wall Surface
$solidWallBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 48, 75))
$g.FillRectangle($solidWallBrush, $sealX, $sealY, $sealW, $sealH)

$dashPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 82, 82), 2)
$dashPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawRectangle($dashPen, $sealX, $sealY, $sealW, $sealH)

# Faint ghost of the protected COM port inside
$ghostPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 100, 140), 1)
$ghostPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
$g.DrawRectangle($ghostPen, $sealX + 28, $sealY + 25, $receptW, $receptH)

# Solid Wall Badges
$g.DrawString("COM / UART PORT", $labelFont, $redBrush, $sealX + 40, $sealY + 30)
$g.DrawString("[SEALED INTERNALLY]", $labelFont, $whiteBrush, $sealX + 25, $sealY + 55)
$g.DrawString("SOLID 2.0mm PETG WALL", $microFont, $grayBrush, $sealX + 38, $sealY + 80)

$g.DrawString("COM / UART SEALED", $labelFont, $redBrush, $sealX + 30, $sealY + $sealH + 15)
$g.DrawString("PROTECTED FACTORY INTERFACE", $subFont, $grayBrush, $sealX + 5, $sealY + $sealH + 38)
$g.DrawString("Tamper-proof & Zero-Dust Ingress", $microFont, $mintBrush, $sealX + 22, $sealY + $sealH + 58)

# Save Front View
$frontPathBrain = "$brainDir\single_usb_enclosure_front.png"
$frontPathWs = "$wsDir\single_usb_enclosure_front.png"
$bmp.Save($frontPathBrain, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($frontPathWs, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

Write-Output "[OK] Generated: single_usb_enclosure_front.png"

# ==============================================================================
# IMAGE 2: ISOMETRIC SEATED VIEW (ESP32 SEATED IN BASE WITH SINGLE PORT)
# ==============================================================================
$bmp2 = New-Object System.Drawing.Bitmap($w, $h)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$g2.FillRectangle($bgBrush, 0, 0, $w, $h)
for ($x = 0; $x -lt $w; $x += 40) { $g2.DrawLine($gridPen, $x, 0, $x, $h) }
for ($y = 0; $y -lt $h; $y += 40) { $g2.DrawLine($gridPen, 0, $y, $w, $y) }

$g2.DrawString('PRE-WELDED ESP32-S3 SEATED IN 13.0mm SPACIOUS BASE', $titleFont, $cyanBrush, 50, 35)
$g2.DrawString('Native USB Aligned with Front Cutout - COM Port Resting Safely Behind Solid Front Wall', $subFont, $grayBrush, 50, 70)

# Draw Isometric Enclosure Base Cavity
$isoFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 25, 42))
$basePoints = @(
    (New-Object System.Drawing.Point(200, 240)),
    (New-Object System.Drawing.Point(520, 130)),
    (New-Object System.Drawing.Point(820, 230)),
    (New-Object System.Drawing.Point(500, 350))
)
$g2.FillPolygon($isoFill, $basePoints)

# PCB Board (Matte Black with Cyan Outline)
$pcbBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 18, 28))
$pcbPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 242, 254), 2)
$pcbPoints = @(
    (New-Object System.Drawing.Point(260, 225)),
    (New-Object System.Drawing.Point(500, 145)),
    (New-Object System.Drawing.Point(740, 225)),
    (New-Object System.Drawing.Point(500, 310))
)
$g2.FillPolygon($pcbBrush, $pcbPoints)
$g2.DrawPolygon($pcbPen, $pcbPoints)

# Yellow Header Pin Rails Under Board
$yellowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 190, 16))
# Left rail
$railL = @(
    (New-Object System.Drawing.Point(340, 280)),
    (New-Object System.Drawing.Point(360, 273)),
    (New-Object System.Drawing.Point(490, 195)),
    (New-Object System.Drawing.Point(470, 202))
)
$g2.FillPolygon($yellowBrush, $railL)

# Right rail
$railR = @(
    (New-Object System.Drawing.Point(510, 273)),
    (New-Object System.Drawing.Point(530, 280)),
    (New-Object System.Drawing.Point(640, 202)),
    (New-Object System.Drawing.Point(620, 195))
)
$g2.FillPolygon($yellowBrush, $railR)

# S3 Metal RF Shielding Can
$rfBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 200, 215))
$rfPoints = @(
    (New-Object System.Drawing.Point(440, 195)),
    (New-Object System.Drawing.Point(540, 162)),
    (New-Object System.Drawing.Point(600, 182)),
    (New-Object System.Drawing.Point(500, 215))
)
$g2.FillPolygon($rfBrush, $rfPoints)
$g2.DrawString("ESP32-S3-WROOM-1", $microFont, [System.Drawing.Brushes]::Black, 470, 185)

# Dual USB Receptacles on the PCB
# Left USB (Native OTG) -> Aligned with Open Cutout!
$usb1Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 225, 240))
$usb1Points = @(
    (New-Object System.Drawing.Point(420, 290)),
    (New-Object System.Drawing.Point(460, 275)),
    (New-Object System.Drawing.Point(480, 282)),
    (New-Object System.Drawing.Point(440, 297))
)
$g2.FillPolygon($usb1Brush, $usb1Points)

# Right USB (COM/UART) -> Covered by Wall!
$usb2Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 135, 150))
$usb2Points = @(
    (New-Object System.Drawing.Point(520, 290)),
    (New-Object System.Drawing.Point(560, 275)),
    (New-Object System.Drawing.Point(580, 282)),
    (New-Object System.Drawing.Point(540, 297))
)
$g2.FillPolygon($usb2Brush, $usb2Points)

# Front Enclosure Wall Isometric (Solid Right Wall block covering USB 2)
$wallBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 48, 75))
$wallPoints = @(
    (New-Object System.Drawing.Point(500, 350)),
    (New-Object System.Drawing.Point(500, 305)),
    (New-Object System.Drawing.Point(820, 190)),
    (New-Object System.Drawing.Point(820, 230))
)
$g2.FillPolygon($wallBrush, $wallPoints)

# Callout Annotations
$annotPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 242, 254), 2)
$g2.DrawLine($annotPen, 440, 310, 380, 390)
$g2.DrawString("1. NATIVE USB PORT", $labelFont, $cyanBrush, 240, 395)
$g2.DrawString("Aligned with 12mm Front Cutout", $subFont, $whiteBrush, 240, 420)

$redAnnotPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 82, 82), 2)
$g2.DrawLine($redAnnotPen, 560, 295, 640, 390)
$g2.DrawString("2. COM / UART PORT", $labelFont, $redBrush, 640, 395)
$g2.DrawString("Sealed Behind Solid 2.0mm Wall", $subFont, $whiteBrush, 640, 420)

$mintAnnotPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(85, 214, 190), 2)
$g2.DrawLine($mintAnnotPen, 350, 260, 180, 260)
$g2.DrawString("3. PRE-WELDED PINS", $labelFont, $mintBrush, 60, 245)
$g2.DrawString("8.5mm Pins Hang in 13.0mm Trough", $subFont, $whiteBrush, 60, 270)
$g2.DrawString('Fits DuPont Jumpers (+4.5mm Gap)', $microFont, $grayBrush, 60, 292)

# Save Isometric View
$bmp2.Save("$brainDir\single_usb_enclosure_inside.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp2.Save("$wsDir\single_usb_enclosure_inside.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()

Write-Output "[OK] Generated: single_usb_enclosure_inside.png"
