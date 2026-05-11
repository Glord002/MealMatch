from pathlib import Path
import os

import psycopg
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

DATABASE_URL = os.environ["DATABASE_URL"]


DEMO_ACCOUNTS = [
    {
        "account_name": "Sunrise Bakery",
        "email": "donations@sunrisebakery.org",
        "address_line1": "101 Peachtree St NE",
        "address_line2": "Rear pickup entrance",
        "city": "Atlanta",
        "state": "GA",
        "postal_code": "30303",
        "food_genre": "Bakery items",
    },
    {
        "account_name": "Green Table Bistro",
        "email": "hello@greentablebistro.com",
        "address_line1": "245 Auburn Ave",
        "address_line2": None,
        "city": "Atlanta",
        "state": "GA",
        "postal_code": "30312",
        "food_genre": "Prepared meals",
    },
    {
        "account_name": "Fresh Route Market",
        "email": "community@freshroute.market",
        "address_line1": "800 Memorial Dr SE",
        "address_line2": "Dock B",
        "city": "Atlanta",
        "state": "GA",
        "postal_code": "30316",
        "food_genre": "Produce",
    },
]


DEMO_DONATIONS = [
    {
        "account_name": "Sunrise Bakery",
        "notes": "18 trays of assorted pastries boxed for same-day pickup.",
        "status": "pending",
    },
    {
        "account_name": "Green Table Bistro",
        "notes": "40 prepared meals chilled and labeled by entree type.",
        "status": "pending",
    },
    {
        "account_name": "Fresh Route Market",
        "notes": "Mixed produce donation including carrots, greens, and apples.",
        "status": "pending",
    },
]


def main():
    inserted_accounts = 0
    inserted_donations = 0

    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            for account in DEMO_ACCOUNTS:
                cur.execute(
                    """
                    INSERT INTO accounts (
                        account_name,
                        password_hash,
                        email,
                        address_line1,
                        address_line2,
                        city,
                        state,
                        postal_code,
                        food_genre
                    )
                    VALUES (
                        %(account_name)s,
                        %(password_hash)s,
                        %(email)s,
                        %(address_line1)s,
                        %(address_line2)s,
                        %(city)s,
                        %(state)s,
                        %(postal_code)s,
                        %(food_genre)s
                    )
                    ON CONFLICT (account_name) DO UPDATE
                    SET
                        email = EXCLUDED.email,
                        address_line1 = EXCLUDED.address_line1,
                        address_line2 = EXCLUDED.address_line2,
                        city = EXCLUDED.city,
                        state = EXCLUDED.state,
                        postal_code = EXCLUDED.postal_code,
                        food_genre = EXCLUDED.food_genre
                    RETURNING id, xmax = 0 AS inserted;
                    """,
                    {
                        **account,
                        "email": account["email"].lower(),
                        "password_hash": "demo-seeded-account",
                    },
                )
                row = cur.fetchone()
                if row and row[1]:
                    inserted_accounts += 1

            for donation in DEMO_DONATIONS:
                cur.execute(
                    "SELECT id FROM accounts WHERE account_name = %(account_name)s;",
                    {"account_name": donation["account_name"]},
                )
                account_row = cur.fetchone()
                if account_row is None:
                    continue

                account_id = account_row[0]
                cur.execute(
                    """
                    SELECT id
                    FROM donations
                    WHERE account_id = %(account_id)s
                      AND notes = %(notes)s
                      AND status = %(status)s
                    LIMIT 1;
                    """,
                    {
                        "account_id": account_id,
                        "notes": donation["notes"],
                        "status": donation["status"],
                    },
                )
                if cur.fetchone():
                    continue

                cur.execute(
                    """
                    INSERT INTO donations (account_id, notes, status)
                    VALUES (%(account_id)s, %(notes)s, %(status)s);
                    """,
                    {
                        "account_id": account_id,
                        "notes": donation["notes"],
                        "status": donation["status"],
                    },
                )
                inserted_donations += 1

    print(
        f"Seed complete: {inserted_accounts} account(s) inserted, "
        f"{inserted_donations} donation(s) inserted."
    )


if __name__ == "__main__":
    main()
