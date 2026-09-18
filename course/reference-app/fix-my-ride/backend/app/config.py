from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Quick local test (no Postgres): sqlite:///./fixmyride.db
    # Course / production-like: postgresql+psycopg://USER:PASSWORD@localhost:5432/fixmyride
    database_url: str = "sqlite:///./fixmyride.db"
    secret_key: str = "cverse-dev-secret-change-me"
    access_token_expire_minutes: int = 480
    algorithm: str = "HS256"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
