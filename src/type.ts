type Weather = "pluie" | "beau" | "neige";

interface City {
    zipCode: string;
    name: string;
}

interface WeatherBulletin {
    id: number;
    zipCode: string;
    townName: string;
    weather: Weather;
}

export { City, WeatherBulletin, Weather };