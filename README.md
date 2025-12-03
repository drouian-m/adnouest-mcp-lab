# Atelier Model Context Protocol (MCP)

Documentation officielle : https://modelcontextprotocol.io/docs/getting-started/intro

SDK Typescript : https://github.com/modelcontextprotocol/typescript-sdk

Pour tous les exercices, les modifications doivent être faites dans le fichier `src/mcp.ts` et dans le fichier `src/main.js` pour charger vos fonctionnalités dans le serveur MCP.

## Exercice 1 - Revue de code

Créer un serveur qui expose un template de prompt pour faire une revue de code.

Le schema des arguments du prompt doit contenir un seul champ `code` de type string.

Le template de prompt sera le suivant : 

```txt
Fait une revue de code en te concentrant sur les bonnes pratiques et les bugs potentiels.

Format ta réponse avec :
✅ Points positifs
⚠️ Points à améliorer
💡 Suggestions :\n\n
${code}
```

Testez votre prompt en utilisant le client MCP défini dans `.vscode/mcp.json` puis ouvrir un nouveau chat dans copilot en mode Agent.

## Exercice 2 - Calculatrice

Écrire une calculatrice sous forme d'outils MCP qui expose les opérations de base :
- addition
- soustraction
- multiplication
- division

## Exercice 3 - Calculatrice (suite)

Compléter votre calculatrice avec des templates de prompts pour chaque opération.

## Exercice 4 - Agent météo

Écrire un outil MCP qui permet de récupérer la météo actuelle d'une ville en utilisant l'API OpenWeather (`https://api.openweathermap.org/data/2.5/weather?lat={{lat}}&lon={{lon}}&units=metric&appid={{apikey}}`).

La clé d'API est fournie pour l'exercice via la variable d'environnement `OPENWEATHER_KEY`.

L'outil prendra en paramètre la latitude et la longitude de la ville et devra retourner un message texte avec la météo actuelle contenant :

- la température
- la description (weather description)
- l'humidité
- la vitesse du vent
- la température ressentie

Il pourra être utilisé de la manière suivante dans un prompt :

```txt
Donne moi la météo actuelle à Vannes.
```

## Exercice bonus - Prévision météo

Compléter l'outil météo pour qu'il puisse retourner les prévisions météo pour les X prochains jours.

Utiliser cette fois l'API `https://api.openweathermap.org/data/2.5/forecast?lat={{lat}}&lon={{lon}}&units=metric&appid={{apikey}}`
