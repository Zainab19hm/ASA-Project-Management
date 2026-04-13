from django.urls import path

from .views import AnalyzeRisksView, AnalyzeScopeView, GenerateGanttView, GenerateWBSView


urlpatterns = [
	path("analyze-scope", AnalyzeScopeView.as_view(), name="analyze-scope"),
	path("generate-wbs", GenerateWBSView.as_view(), name="generate-wbs"),
	path("generate-gantt", GenerateGanttView.as_view(), name="generate-gantt"),
	path("analyze-risks", AnalyzeRisksView.as_view(), name="analyze-risks"),
]
