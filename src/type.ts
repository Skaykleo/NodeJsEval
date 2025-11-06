type Weather = "pluie" | "beau" | "neige";

interface City {
    name: string;
    zipCode: string;
}

interface WeatherBulletin {
    id: number;
    zipCode: string;
    townName: string;
    weather: Weather;
}

export { City, WeatherBulletin, Weather };