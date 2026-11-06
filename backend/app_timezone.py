from datetime import date, datetime
from zoneinfo import ZoneInfo


JST = ZoneInfo("Asia/Tokyo")


def now_jst() -> datetime:
    """現在時刻をタイムゾーン情報付きの日本時間で返す"""
    return datetime.now(JST)


def now_jst_naive() -> datetime:
    """既存のDBのDateTimeカラムに合わせて、タイムゾーン情報なしの日本時間で返す"""
    return now_jst().replace(tzinfo=None)


def today_jst() -> date:
    return now_jst().date()
