# Tests de l'API avec curl

## Pour savoir si le serveur est ouvert
```
curl http://localhost:3000/
```
## Pour tester les différentes routes de l'API
### Pour avoir la liste des villes
```
curl http://localhost:3000/cities
```
### Pour avoir une ville en fonction de son code postal
```
curl http://localhost:3000/cities/69000
```
### Pour essayer d'avoir une ville qui n'existe pas
```
curl http://localhost:3000/cities/99999
```
### Pour supprimer une ville en fonction de son code postal
```
curl -X DELETE http://localhost:3000/cities/75000
```
### Pour essayer de supprimer une ville qui n'existe pas
```
curl -X DELETE http://localhost:3000/cities/99999
```
### Pour mettre à jour le nom d'une ville
```
curl -X PUT http://localhost:3000/cities/13000 \
-H "Content-Type: application/json" \
-d '{"name":"Marseille Updated"}'
```
### Pour essayer de mettre à jour une ville qui n'existe pas
```
curl -X PUT http://localhost:3000/cities/99999 \
-H "Content-Type: application/json" \
-d '{"name":"Marseille Updated"}'
```
### Pour avoir la météo d'une ville en fonction de son code postal
```
curl http://localhost:3000/cities/75000/weather
```
### Pour essayer d'avoir la météo d'une ville qui n'existe pas
```
curl http://localhost:3000/cities/99999/weather
```
### Pour ajouter une météo à une ville
```
curl -X POST http://localhost:3000/cities/69000/weather \
-H "Content-Type: application/json" \
-d '{"weather":"pluie"}'
```
### Pour essayer d'ajouter une météo à une ville qui n'existe pas
```
curl -X POST http://localhost:3000/cities/99999/weather \
-H "Content-Type: application/json" \
-d '{"weather":"pluie"}'
```
### Pour essayer d'ajouter une météo avec un format invalide
```
curl -X POST http://localhost:3000/cities/31000/weather \
-H "Content-Type: application/json" \
-d '{"weather":"orage"}'
```
### Pour supprimer une météo en fonction de son identifiant
```
curl -X DELETE http://localhost:3000/weather/1
```
### Pour essayer de supprimer une météo qui n'existe pas
```
curl -X DELETE http://localhost:3000/weather/99999
```
### Pour avoir la météo d'une ville en fonction de son code postal et de l'identifiant de la météo
```
curl http://localhost:3000/cities/13000/weather/3
```
### Pour essayer d'avoir la météo d'une ville qui existe avec un identifiant de météo non valide
```
curl http://localhost:3000/cities/13000/weather/99999
```
### Pour essayer d'avoir la météo d'une ville qui n'existe pas avec un identifiant de météo valide
```
curl http://localhost:3000/cities/99999/weather/3
```
### Pour avoir une météo en fonction de son identifiant
```
curl http://localhost:3000/weather/3
```
### Pour essayer d'avoir une météo avec un identifiant qui n'existe pas
```
curl http://localhost:3000/weather/99999
```
### Pour avoir la liste de toutes les météos
```
curl http://localhost:3000/weather
```