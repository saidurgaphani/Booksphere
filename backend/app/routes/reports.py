from fastapi import APIRouter, Query, Response
from app.services import report_service

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/export")
def export_report(
    format: str = Query("csv", pattern="^(csv|txt)$", description="Report format: csv or txt")
):
    if format == "csv":
        content = report_service.generate_csv_report()
        return Response(
            content=content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=booksphere_reading_report.csv"}
        )
    else:
        content = report_service.generate_txt_report()
        return Response(
            content=content,
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=booksphere_reading_report.txt"}
        )
