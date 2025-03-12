"""
Utility functions for database operations.

This module provides helper functions used across multiple views, 
including `dictfetchall`, which converts database cursor results 
into a list of dictionaries.

Functions:
    - dictfetchall(cursor): Converts cursor results into a list of dictionaries, 
      where each dictionary represents a row with column names as keys.

Example Usage:
    with connection.cursor() as cursor:
        cursor.execute(sql_query, [startDate, request.user.id])
        report_data = dictfetchall(cursor)
"""

def dictfetchall(cursor):
    """
    Convert all rows from a cursor into a list of dictionaries.

    Args:
        cursor: A database cursor after executing a query.

    Returns:
        A list of dictionaries where each dictionary represents a row, 
        with column names as keys.
    """
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]
