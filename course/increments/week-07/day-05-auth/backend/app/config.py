from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://localhost:5432/fixmyride"
    secret_key: str = "cverse-dev-secret-change-me"
    access_token_expire_minutes: int = 480
    algorithm: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
