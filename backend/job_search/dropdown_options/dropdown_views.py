import logging
from collections import defaultdict

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.cache import cache

# from urllib3 import request

from job_search.dropdown_options.dropdown_option import (
    DropdownOption,
    DropdownOptionCategories,
)
from job_search.dropdown_options.dropdown_serializer import (
    DropdownOptionSerializer,
)

from job_search.job_site.job_site import JobSite
from job_search.job_site.job_site_serializer import JobSiteDropdownSerializer

logger = logging.getLogger(__name__)  # Set up logging for this module


class DropdownOptionsView(APIView):
    """
    Returns all dropdown options grouped by category.
    Used to populate frontend select inputs in one call.
    """

    def get(self, request, pk=None):
        if not request.user.is_authenticated:
            logger.warning("Unauthenticated request received for dropdown options.")
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # -----------------------------
        # DETAIL VIEW (GET /api/dropdown_options/3/)
        # -----------------------------
        if pk is not None:
            try:
                option = DropdownOption.objects.get(pk=pk)
            except DropdownOption.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = DropdownOptionSerializer(option)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # -----------------------------
        # LIST VIEW WITH OPTIONAL CATEGORY FILTER (GET /api/dropdown_options/?category=application_source)
        # -----------------------------
        category = request.GET.get("category")
        if category:
            category = category.replace("-", "_")
            dropdown_qs = DropdownOption.objects.filter(
                is_active=True, category=category
            ).order_by("sort_order")

            serializer = DropdownOptionSerializer(dropdown_qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        cache_key = f"dropdown_options_{request.user.id}"  # Unique cache key per user
        logger.info("Checking cache for key: %s", cache_key)  # Log cache check
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            logger.info(
                "Cache hit - returning cached dropdown options."
            )  # Log cache hit
            return Response(cached_data)

        logger.info(
            "Cache miss - querying database for dropdown options."
        )  # Log cache miss

        # -----------------------------
        # Dropdown options (static refs)
        # -----------------------------
        dropdown_qs = DropdownOption.objects.filter(is_active=True).order_by(
            "category", "sort_order"
        )

        serialized_dropdowns = DropdownOptionSerializer(dropdown_qs, many=True).data

        dropdown_data = defaultdict(list)

        for item in serialized_dropdowns:
            dropdown_data[item["category"]].append(
                {
                    "id": item["id"],
                    "name": item["name"],
                    "sort_order": item["sort_order"],
                }
            )

        # -----------------------------
        # Job Sites (user-specific)
        # -----------------------------
        job_sites_qs = JobSite.objects.filter(user=request.user).order_by(
            "id", "rating", "site_name"
        )

        job_sites = JobSiteDropdownSerializer(job_sites_qs, many=True).data

        # -----------------------------
        # Final payload
        # -----------------------------
        response_payload = {
            "dropdown_options": dropdown_data,
            "job_sites": job_sites,
        }
        cache.set(cache_key, response_payload, timeout=3600)
        return Response(response_payload, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response(status=401)

        try:
            option = DropdownOption.objects.get(pk=pk)
        except DropdownOption.DoesNotExist:
            return Response(status=404)

        option.delete()
        cache.delete(f"dropdown_options_{request.user.id}")
        return Response(status=204)

    def patch(self, request, pk):
        if not request.user.is_authenticated:
            return Response(status=401)

        try:
            option = DropdownOption.objects.get(pk=pk)
        except DropdownOption.DoesNotExist:
            return Response(status=404)

        serializer = DropdownOptionSerializer(option, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete(f"dropdown_options_{request.user.id}")

            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(status=401)

        serializer = DropdownOptionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            cache.delete(f"dropdown_options_{request.user.id}")
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
