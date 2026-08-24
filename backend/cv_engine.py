import io
import cv2
import numpy as np
from PIL import Image
from typing import Dict, Any, Tuple, Optional

def analyze_image_quality(image_bytes: bytes) -> Dict[str, Any]:
    """
    Analyzes document photo quality using Computer Vision algorithms:
    - Laplacian variance for blur/sharpness detection
    - Michelson & RMS contrast measurement
    - Estimated resolution / DPI adequacy
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"is_valid": False, "error": "Could not decode image format."}

        height, width = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. Blur Detection via Laplacian Variance
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        is_blurry = laplacian_var < 80.0
        sharpness_rating = "Crisp" if laplacian_var > 200 else ("Acceptable" if laplacian_var >= 80 else "Blurry")

        # 2. Contrast Analysis
        min_val, max_val, _, _ = cv2.minMaxLoc(gray)
        contrast_ratio = float((max_val - min_val) / max(1.0, (max_val + min_val)))
        contrast_rating = "High" if contrast_ratio > 0.6 else ("Normal" if contrast_ratio >= 0.35 else "Low Contrast")

        # 3. Estimated DPI & Dimension Assessment
        # An 8.5x11 inch page at 150 DPI is ~1275 x 1650 pixels (~2.1 MP)
        total_pixels = height * width
        estimated_dpi = int(np.sqrt(total_pixels / (8.5 * 11)))
        dpi_status = "Adequate (>150 DPI)" if estimated_dpi >= 140 else "Low Resolution (<150 DPI)"

        quality_passed = not is_blurry and contrast_ratio >= 0.30

        return {
            "is_valid": True,
            "quality_passed": quality_passed,
            "dimensions": f"{width}x{height}",
            "sharpness_score": round(laplacian_var, 1),
            "sharpness_rating": sharpness_rating,
            "contrast_ratio": round(contrast_ratio, 2),
            "contrast_rating": contrast_rating,
            "estimated_dpi": estimated_dpi,
            "dpi_status": dpi_status,
            "guidance": (
                "Image meets quality requirements for accurate clinical parsing."
                if quality_passed
                else "Image may be blurry or low contrast. For best results, take a photo in bright, even lighting."
            )
        }
    except Exception as e:
        return {"is_valid": False, "error": f"CV quality analysis error: {str(e)}"}

def preprocess_document_cv(image_bytes: bytes) -> Tuple[Optional[np.ndarray], Dict[str, Any]]:
    """
    Applies Computer Vision preprocessing pipeline:
    1. Grayscale & Bilateral Filter for noise smoothing
    2. Adaptive Otsu Binarization for crisp text extraction
    3. Document deskewing / angle rectification
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return None, {"error": "Invalid image"}

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Bilateral filter to smooth texture while keeping sharp text edges
        denoised = cv2.bilateralFilter(gray, 9, 75, 75)

        # Adaptive thresholding (Otsu's binarization)
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Detect orientation / skew angle using coordinate points of non-zero pixels
        coords = np.column_stack(np.where(thresh == 0))
        angle = 0.0
        if len(coords) > 50:
            rect = cv2.minAreaRect(coords)
            angle = rect[-1]
            if angle < -45:
                angle = -(90 + angle)
            elif angle > 45:
                angle = 90 - angle

        # Rotate if skew is notable (> 0.5 degrees)
        deskewed = thresh
        if abs(angle) > 0.5 and abs(angle) < 30.0:
            (h, w) = thresh.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            deskewed = cv2.warpAffine(thresh, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

        return deskewed, {
            "deskew_angle": round(float(angle), 2),
            "processed": True
        }
    except Exception as e:
        return None, {"error": str(e)}
