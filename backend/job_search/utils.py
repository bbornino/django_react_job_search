# import pdb

# Helper function to convert cursor data to a dictionary
def dictfetchall(cursor):
    "Return all rows from a cursor as a dictionary"
    # pdb.set_trace()
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]
