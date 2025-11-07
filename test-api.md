curl http://localhost:3000/

curl http://localhost:3000/cities

curl http://localhost:3000/cities/69000
curl http://localhost:3000/cities/99999

curl -X DELETE http://localhost:3000/cities/75000
curl -X DELETE http://localhost:3000/cities/99999

curl -X PUT http://localhost:3000/cities/13000 \
-H "Content-Type: application/json" \
-d '{"name":"Marseille Updated"}'
curl -X PUT http://localhost:3000/cities/99999 \
-H "Content-Type: application/json" \
-d '{"name":"Marseille Updated"}'

curl http://localhost:3000/cities/69000/weather
curl http://localhost:3000/cities/99999/weather
curl http://localhost:3000/cities/31000/weather

curl -X POST http://localhost:3000/cities/69000/weather \
-H "Content-Type: application/json" \
-d '{"weather":"pluie"}'
curl -X POST http://localhost:3000/cities/99999/weather \
-H "Content-Type: application/json" \
-d '{"weather":"pluie"}'
curl -X POST http://localhost:3000/cities/31000/weather \
-H "Content-Type: application/json" \
-d '{"weather":"orage"}'

curl -X DELETE http://localhost:3000/weather/1
curl -X DELETE http://localhost:3000/weather/99999

curl http://localhost:3000/cities/13000/weather/3
curl http://localhost:3000/cities/13000/weather/99999
curl http://localhost:3000/cities/99999/weather/3

curl http://localhost:3000/weather/3
curl http://localhost:3000/weather/99999

curl http://localhost:3000/weather