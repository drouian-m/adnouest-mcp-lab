---
marp: true
theme: default
paginate: true
---

# Model Context Protocol (MCP)
## Initiation aux serveurs MCP

*Atelier pratique - 2 heures*

![bg right](https://mintcdn.com/mcp/4ZXF1PrDkEaJvXpn/mcp.png?w=1100&fit=max&auto=format&n=4ZXF1PrDkEaJvXpn&q=85&s=fc83c85802998c592cdabe9789541140)

---

## **Programme de l'atelier**

### **Première heure**
- (15 min) Présentation de la techno MCP
- (45 min) **Exercices pratiques** en TypeScript (création de votre premier MCP)

### **Deuxième heure**
- (50 min) **POC libres** sur vos cas d'usage, nos produits, nos outils ...
- (10 min) Conclusion

---

## **Prérequis techniques**

### **💻 Environnement**
- Node.js 24 installé
- IDE VS Code (on va utiliser le fichier mcp.json pour dialoguer avec les serveurs MCP)

---

## **Qu'est-ce que MCP ?**

- **Protocole** de communication standardisé
- Développé par **Anthropic** en open source
- Permet aux **modèles IA** d'accéder à des **ressources externes**
- Interface unifiée entre IA et applications/services

---

## **Architecture**

![schema](https://mintcdn.com/mcp/bEUxYpZqie0DsluH/images/mcp-simple-diagram.png?fit=max&auto=format&n=bEUxYpZqie0DsluH&q=85&s=35268aa0ad50b8c385913810e7604550)

---

## **Communication**

Le protocole MCP est basé sur du **JSON RPC 2.0** pour les échanges entre le modèle IA et le serveur MCP.

Pour la partie transport, on utilise généralement le protocole **HTTP en mode streaming**, mais il est également possible d'utiliser le mode Stdio (on écoute les entrées/sorties standard du processus).

---

## **Exemple de requête / réponse**

```json
{
  "method": "tools/call",
  "params": {
    "name": "calculator-add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  }
}
```

```json
{
  "result": {
    "content": [{"type": "text", "text": "8"}],
    "structuredContent": { "result": 8 }
  }
}
```


## **Pourquoi MCP ?**

### **Avant MCP**
- Intégrations IA complexes et spécifiques
- Duplication de code pour chaque LLM
- Maintenabilité ?

### **Avec MCP**
- **Une interface** pour tous les modèles
- **Réutilisabilité** des connecteurs
- **Standardisation** des échanges

---

## **Fonctionnalités proposées**

### **📄 Ressources (Resources)**
Données que l'IA peut lire
```javascript
// Exemple : fichier de config
config://database.json
```

### **💬 Prompts**
Templates de prompts réutilisables : le serveur MCP retourne le template de prompt avec les variables à remplir au client LLM.
```javascript
// Exemple : analyse de données
analyze_data(dataset, metric)
```

---

## **Fonctionnalités proposées**

### **🔧 Outils (Tools)**
Fonctions que l'IA peut appeler via le client LLM.
```javascript
// Exemple : calculatrice
calculator.add(5, 3) → 8
```

### **Exemple (VSCode Copilot Chat)**

> Fais moi la somme de 5 et 3.
> *Ran `calculator-add` - mcp-local (MCP Server)*
> La somme de 5 et 3 est 8.


---

## **Cas d'usage concrets**

- **🌐 APIs externes** : Météo, finance, réseaux sociaux
- **🗄️ Bases de données** : Requêtes SQL dynamiques
- **📁 Systèmes de fichiers** : Lecture/écriture de documents
- **⚙️ Outils internes** : Monitoring, logs, configurations
- **🔍 Recherche** : Elasticsearch, bases vectorielles

---

## **Écosystème MCP**

### **SDK Officiel fourni pour de nombreux langages**

https://github.com/modelcontextprotocol

- **TypeScript** : https://github.com/modelcontextprotocol/typescript-sdk
- **Java** : https://github.com/modelcontextprotocol/java-sdk
- **Rust** : https://github.com/modelcontextprotocol/rust-sdk
- **Python** : https://github.com/modelcontextprotocol/python-sdk

### **Outils de développement**
- MCP Inspector pour tester les serveurs
```sh
npx @modelcontextprotocol/inspector
```

---

## Serveurs MCP populaires

https://mcpservers.org/

Exemple : [Context7](https://context7.com/)

Serveur MCP qui propose la documentation de nombreuses librairies / projets github.

Permet d'avoir des résultats plus pertinents dans les chatbots grâce à un contexte précis.


---

## **Exercices pratiques**

**A vous de jouer !**

![bg right](image-1.png)

---

## **POC libres**

Mettre en pratique les concepts appris sur vos cas d'usage, nos produits, nos outils ...

---

## **Conclusion**