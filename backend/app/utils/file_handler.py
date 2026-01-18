import pdfplumber
import io

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    """
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_bytes(file_content: bytes, filename: str) -> str:
    """
    Extracts text based on file extension.
    """
    if filename.lower().endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    else:
        # Assume plain text for now
        try:
            return file_content.decode('utf-8')
        except UnicodeDecodeError:
            return ""
