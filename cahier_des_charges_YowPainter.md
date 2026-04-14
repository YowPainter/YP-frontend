# YowPainter
## Platform for Freelance Painters & Visual Artists

**Cahier des Charges**
Spécification Fonctionnelle & Technique

**Date :** 25 Mars 2026
**Statut :** Livrable Initial
**Stack :** Spring Boot · Next.js
**Modèle :** SaaS Multi-Tenant

*YowPainter© 2026*

---

## Table des matières

1. [Contexte et Présentation](#1-contexte-et-présentation)
   - 1.1 Contexte du Projet
   - 1.2 Présentation de la Solution
     - 1.2.1 Identité du Projet
2. [Objectifs du Projet](#2-objectifs-du-projet)
   - 2.1 Objectifs Fonctionnels
   - 2.2 Objectifs Non-Fonctionnels
3. [Périmètre et Parties Prenantes](#3-périmètre-et-parties-prenantes)
   - 3.1 Parties Prenantes
   - 3.2 Périmètre du Projet
4. [Fonctionnalités Détaillées](#4-fonctionnalités-détaillées)
   - 4.1 Module Authentification & Compte
   - 4.2 Module Publication d'Œuvres
   - 4.3 Module Boutique
   - 4.4 Module Événements & Expositions
     - 4.4.1 Types d'Événements
     - 4.4.2 Fonctionnalités Événementielles
   - 4.5 Module Tableau de Bord Artiste
   - 4.6 Module Abonnement SaaS
5. [Contraintes Non-Fonctionnelles](#5-contraintes-non-fonctionnelles)
   - 5.1 Sécurité
   - 5.2 Scalabilité & Disponibilité
6. [Architecture et Stack Technique](#6-architecture-et-stack-technique)
   - 6.1 Stack Technique
   - 6.2 Modèle Multi-Tenant
7. [Critères de Réception](#7-critères-de-réception)
   - 7.1 Critères Fonctionnels
   - 7.2 Critères Techniques
- [Glossaire](#glossaire)

---

## 1 Contexte et Présentation

### 1.1 Contexte du Projet

Le marché de l'art plastique amateur connaît une croissance soutenue, portée par la démocratisation des réseaux sociaux et l'essor du commerce en ligne. Pourtant, les artistes peintres et plasticiens amateurs ne disposent aujourd'hui d'aucun espace véritablement dédié, professionnel et sécurisé pour développer leur activité. Les plateformes généralistes noient leur travail dans un flux impersonnel, tandis que les solutions de vente en ligne restent trop techniques ou inadaptées aux spécificités des œuvres d'art.

YowPainter répond à ce manque en offrant un environnement conçu sur mesure, où chaque artiste peut présenter ses créations, les vendre directement, organiser ses propres expositions et gérer l'ensemble de son activité freelance de manière autonome et mesurable.

### 1.2 Présentation de la Solution

> **YowPainter — Définition**
>
> YowPainter est une plateforme SaaS multi-tenant pensée exclusivement pour les artistes peintres et plasticiens amateurs freelance. Elle offre à chaque artiste un espace personnel complet : portfolio numérique, boutique en ligne, gestion d'expositions et billetterie électronique.

#### 1.2.1 Identité du Projet

Le tableau ci-dessous résume les caractéristiques fondamentales du projet :

| Élément | Valeur |
|---|---|
| Nom commercial | YowPainter |
| Code projet | YWP |
| Modèle économique | SaaS multi-tenant (abonnement mensuel) |
| Domaine métier | Art plastique — Peinture amateur Freelance |
| Objet métier central | Toile (Artwork) |
| Backend | Spring Boot 3.x — Java 21 |
| Frontend | Next.js 16 (App Router) |
| Base de données | PostgreSQL 15+ (schema-per-tenant) |

---

## 2 Objectifs du Projet

### 2.1 Objectifs Fonctionnels

Les objectifs fonctionnels définissent les capacités métier que YowPainter doit offrir. Ils sont priorisés selon leur importance stratégique pour la première version.

| ID | Objectif | Priorité |
|---|---|---|
| OBJ-01 | Permettre aux artistes de publier et gérer leurs œuvres (toiles) | P1 |
| OBJ-02 | Offrir aux visiteurs de liker, commenter et partager les œuvres | P1 |
| OBJ-03 | Mettre en vente des œuvres via une boutique intégrée | P1 |
| OBJ-04 | Créer et gérer des événements d'exposition avec billetterie | P1 |
| OBJ-05 | Offrir un système d'abonnement SaaS multi-plans | P2 |
| OBJ-06 | Fournir un tableau de bord analytique à chaque artiste | P2 |
| OBJ-07 | Intégrer un paiement sécurisé (ventes + billets) | P1 |

### 2.2 Objectifs Non-Fonctionnels

En complément des fonctionnalités, YowPainter doit satisfaire des exigences de qualité qui garantissent la robustesse, la sécurité et l'expérience utilisateur.

| Critère | Cible |
|---|---|
| Disponibilité (SLA) | ≥ 99,5 % |
| Temps de chargement (pages) | < 2 secondes |
| Temps de réponse API (P95) | < 500 ms |
| Upload image max | 10 MB par fichier |
| Génération billet QR | < 1 seconde |
| Conformité sécurité | RGPD, PCI-DSS (Stripe), TLS 1.3 |
| Accessibilité | WCAG 2.1 niveau AA |
| Score Lighthouse | > 85 (Performance, SEO, A11y) |

---

## 3 Périmètre et Parties Prenantes

### 3.1 Parties Prenantes

Trois grandes catégories d'acteurs interagissent avec YowPainter, chacun avec des rôles et responsabilités distincts. Le tableau suivant les décrit :

| Partie Prenante | Rôle | Responsabilités |
|---|---|---|
| Artiste (Tenant) | Utilisateur principal | Publie des œuvres, gère boutique, crée des événements |
| Visiteur public | Utilisateur secondaire | Consulte portfolios, œuvres, événements |
| Acheteur | Visiteur authentifié | Achète des œuvres, réserve des billets |
| Administrateur | Équipe YowPainter | Gère tenants, abonnements, modération |

### 3.2 Périmètre du Projet

La version initiale de YowPainter se concentre sur les fonctionnalités essentielles à la mise en marché rapide. Les éléments listés ci-dessous sont inclus, tandis que d'autres sont reportés à des versions ultérieures.

| Dans le scope (v1) | Hors scope (v1) |
|---|---|
| Publication d'œuvres | Impression à la demande |
| Boutique (listing + achat) | Marketplace inter-artistes |
| Événements + billetterie QR | Live streaming d'expositions |
| Commentaires & likes | Forum communautaire |
| Tableau de bord artiste | Application mobile native |
| Abonnement SaaS multi-plans | Programme de fidélité |

---

## 4 Fonctionnalités Détaillées

### 4.1 Module Authentification & Compte

L'authentification est le socle de l'expérience YowPainter. Elle repose sur un système JWT sécurisé, avec deux profils distincts : l'artiste (créateur de contenu) et le visiteur/acheteur. Le tableau ci-dessous détaille les fonctionnalités de ce module.

| ID | Fonctionnalité | Acteur | Priorité |
|---|---|---|---|
| AUTH-01 | Inscription artiste (email, mot de passe, profil) | Artiste | P1 |
| AUTH-02 | Inscription visiteur/acheteur | Visiteur | P1 |
| AUTH-03 | Connexion (email + mot de passe) | Tous | P1 |
| AUTH-04 | OAuth2 (Google, Facebook) | Tous | P2 |
| AUTH-05 | Réinitialisation mot de passe | Tous | P1 |
| AUTH-06 | Vérification email à l'inscription | Tous | P1 |
| AUTH-07 | Gestion de session JWT + Refresh Token | Système | P1 |
| PROF-01 | Création / édition profil artiste | Artiste | P1 |
| PROF-02 | Personnalisation de l'espace (couleurs, bannière) | Artiste | P2 |
| PROF-03 | Portfolio public consultable par tous | Tous | P1 |

### 4.2 Module Publication d'Œuvres

L'objet métier central de YowPainter est la Toile (Artwork). C'est autour de cet objet que se construisent l'identité de l'artiste, l'interaction avec le public et les transactions commerciales.

> **Objet métier central**
>
> Une Toile est une œuvre d'art publiée par un artiste, avec ses images, sa description, sa technique et son style.

En tant qu'Artiste, je veux publier une œuvre avec : titre, description, jusqu'à 10 photos, technique (huile, aquarelle, acrylique, pastel…), dimensions, style (portrait, paysage, abstrait…), tags libres et statut (publié / brouillon / archivé).

Les fonctionnalités liées à la gestion des œuvres sont les suivantes :

| ID | Fonctionnalité | Acteur | Prior. |
|---|---|---|---|
| ART-01 | Créer une publication d'œuvre | Artiste | P1 |
| ART-02 | Modifier / supprimer une œuvre | Artiste | P1 |
| ART-03 | Galerie publique (grille responsive) | Tous | P1 |
| ART-04 | Page détail d'une œuvre | Tous | P1 |
| ART-05 | Liker une œuvre | Visiteur auth. | P1 |
| ART-06 | Commenter une œuvre | Visiteur auth. | P1 |
| ART-07 | Modérer les commentaires | Artiste | P2 |
| ART-08 | Partager sur réseaux sociaux | Tous | P2 |
| ART-09 | Filtrer / Rechercher les œuvres | Tous | P1 |
| ART-10 | Upload multi-images avec aperçu | Artiste | P1 |

### 4.3 Module Boutique

La boutique permet aux artistes de monétiser leurs créations. Elle s'intègre de manière transparente au portfolio : chaque œuvre peut être mise en vente avec un prix et des frais de port. Le processus d'achat est sécurisé via Stripe, garantissant la conformité PCI-DSS.

| ID | Fonctionnalité | Acteur | Prior. |
|---|---|---|---|
| SHOP-01 | Mettre une œuvre en vente (prix, frais de port) | Artiste | P1 |
| SHOP-02 | Retirer une œuvre de la vente | Artiste | P1 |
| SHOP-03 | Page boutique publique de l'artiste | Tous | P1 |
| SHOP-04 | Panier d'achat | Acheteur | P1 |
| SHOP-05 | Paiement sécurisé (Stripe / Mobile Money) | Acheteur | P1 |
| SHOP-06 | Confirmation de commande (email + notif) | Acheteur | P1 |
| SHOP-07 | Gestion des commandes reçues | Artiste | P1 |
| SHOP-08 | Historique des achats | Acheteur | P2 |
| SHOP-09 | Remboursement / Gestion des litiges | Tous | P2 |

### 4.4 Module Événements & Expositions

Les expositions constituent un canal essentiel pour les artistes. YowPainter propose une gestion complète d'événements, avec trois types adaptés à différents besoins : ouvert gratuit, ouvert payant, privé/limité. La billetterie électronique avec génération de QR code permet un contrôle d'accès simple et efficace.

#### 4.4.1 Types d'Événements

| Type | Description | Billetterie |
|---|---|---|
| Ouvert Gratuit | Accès libre, aucune limite de places | Inscription simple (email) |
| Ouvert Payant | Accessible à tous, tarif unique | Paiement en ligne + billet |
| Privé / Limité | Nombre de places défini | Paiement + billet QR marqué + contrôle d'accès |

#### 4.4.2 Fonctionnalités Événementielles

En tant qu'Artiste, je veux créer un événement en renseignant : nom, description, date/heure début-fin, lieu (adresse ou lien virtuel), affiche, type d'événement, nombre de places disponibles et prix du billet.

| ID | Fonctionnalité | Acteur | Prior. |
|---|---|---|---|
| EVT-01 | Créer un événement | Artiste | P1 |
| EVT-02 | Modifier / annuler un événement | Artiste | P1 |
| EVT-03 | Liste publique des événements | Tous | P1 |
| EVT-04 | Page détail d'un événement | Tous | P1 |
| EVT-05 | Inscription gratuite | Visiteur auth. | P1 |
| EVT-06 | Réservation payante avec paiement Stripe | Acheteur | P1 |
| EVT-07 | Génération de billet électronique (QR code PDF) | Système | P1 |
| EVT-08 | Envoi du billet par email | Système | P1 |
| EVT-09 | Validation de billet à l'entrée (scan QR) | Artiste | P2 |
| EVT-10 | Gestion de la liste des participants | Artiste | P1 |
| EVT-11 | Compteur de places disponibles en temps réel | Tous | P1 |

### 4.5 Module Tableau de Bord Artiste

Pour piloter son activité, l'artiste dispose d'un tableau de bord centralisé. Il regroupe les indicateurs clés, les dernières interactions et les actions à mener.

| ID | Fonctionnalité | Détails |
|---|---|---|
| DASH-01 | Vue d'ensemble | Vues, likes totaux, revenus du mois |
| DASH-02 | Statistiques œuvres | Œuvre la plus likée, vue, commentée |
| DASH-03 | Suivi des ventes | Commandes en cours, complétées, annulées |
| DASH-04 | Gestion événements | Événements à venir, passés, participants |
| DASH-05 | Revenus & paiements | Historique des revenus, virements |
| DASH-06 | Notifications | Likes, commentaires, ventes, inscriptions |

### 4.6 Module Abonnement SaaS

YowPainter repose sur un modèle freemium. Trois plans d'abonnement sont proposés, chacun offrant des limites et des commissions différentes.

| Plan | Prix | Limites |
|---|---|---|
| Gratuit | .../mois | 5 œuvres, 1 événement/mois, commission 10 % |
| Peintre Pro | .../mois | 50 œuvres, 5 événements/mois, commission 5 % |
| Studio Elite | .../mois | Illimité, commission 2 %, analytics avancés |

---

## 5 Contraintes Non-Fonctionnelles

### 5.1 Sécurité

La sécurité est un pilier de la plateforme. L'authentification repose sur des tokens JWT (access token de 15 minutes, refresh token de 7 jours stocké dans Redis) combinée à un contrôle d'accès basé sur les rôles (RBAC). L'isolation multi-tenant garantit qu'un artiste ne peut accéder qu'à ses propres données. Les transactions financières sont externalisées via Stripe, ce qui évite la manipulation de données sensibles côté serveur. La conformité RGPD est assurée par la collecte explicite des consentements, la possibilité d'exporter ses données et le droit à l'oubli. Toutes les communications sont chiffrées en TLS 1.3, et des protections classiques contre les attaques CSRF, XSS et injections SQL sont implémentées.

### 5.2 Scalabilité & Disponibilité

L'architecture de YowPainter est conçue pour évoluer avec son nombre d'utilisateurs. Le backend Spring Boot est sans état (stateless), ce qui permet un passage à l'échelle horizontal derrière un répartiteur de charge. La base de données PostgreSQL utilise la réplication primary/replica pour séparer les lectures des écritures. Les médias sont stockés sur un service cloud (Cloudinary) avec intégration d'un CDN pour un temps de chargement optimisé. Un cache Redis gère les sessions, le rate-limiting et les données fréquemment sollicitées. Enfin, la plateforme est conteneurisée avec Docker et orchestrée via Kubernetes en production, garantissant une haute disponibilité et une reprise rapide après incident.

---

## 6 Architecture et Stack Technique

### 6.1 Stack Technique

Le choix des technologies a été guidé par la recherche de robustesse, de performance et de maintenabilité. Le tableau ci-dessous présente les composants retenus pour chaque couche.

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG, SEO, performance |
| Backend | Spring Boot 3.x (Java 21) | Robustesse, multi-tenant |
| Base de données | PostgreSQL 15 | Schémas par tenant, extensions |
| Cache | Redis 7 | Sessions, rate-limiting, queues |
| Stockage médias | Cloudinary / AWS S3 | Upload, CDN |
| Paiement | Stripe API | PCI-DSS, webhooks |
| Email | SendGrid / Mailjet | Transactionnel, templates HTML |
| QR Code | ZXing (Java) | Génération billets |
| Auth | Spring Security + JWT | Standard industrie |
| API Docs | OpenAPI / Swagger | Documentation auto-générée |
| CI/CD | GitHub Actions | Automatisation |
| Conteneurs | Docker + Kubernetes | Scalabilité |

### 6.2 Modèle Multi-Tenant

> **Stratégie : Schema-per-Tenant**
>
> Chaque artiste (tenant) dispose de son propre schéma PostgreSQL isolé. Le `tenantId` est extrait du JWT à chaque requête, et le `search_path` PostgreSQL est ajusté dynamiquement. Cela garantit une isolation forte des données tout en maintenant une infrastructure centralisée.

---

## 7 Critères de Réception

### 7.1 Critères Fonctionnels

Pour valider la conformité du livrable, chaque fonctionnalité doit satisfaire les critères suivants, vérifiables par des tests d'acceptation :

- ✓ Un artiste peut s'inscrire, créer son profil et publier une œuvre.
- ✓ Un visiteur peut liker et commenter une œuvre.
- ✓ Un acheteur peut acheter une œuvre et recevoir une confirmation par email.
- ✓ Un artiste peut créer un événement payant avec places limitées.
- ✓ Un acheteur reçoit un billet QR après paiement.
- ✓ Les données d'un artiste sont isolées de celles d'un autre (multi-tenant).
- ✓ L'artiste dispose d'un tableau de bord avec statistiques.

### 7.2 Critères Techniques

Les exigences techniques sont mesurées à l'aide d'outils automatisés et de procédures de recette :

- ✓ Temps de chargement inférieur à 2 secondes (mesuré avec Lighthouse).
- ✓ Tous les endpoints API documentés avec Swagger/OpenAPI.
- ✓ Couverture de tests ≥ 70 % (JUnit pour le backend, Jest pour le frontend).
- ✓ Score Lighthouse > 85 (Performance, Accessibilité, SEO).

---

## Glossaire

| Terme | Définition |
|---|---|
| Artiste (Tenant) | Artiste peintre/plasticien ayant un compte et un espace isolé |
| Toile / Artwork | L'objet métier central — une œuvre d'art publiée |
| Tenant | Instance isolée d'un artiste dans l'architecture multi-tenant |
| Billet électronique | PDF + QR code généré après paiement/inscription à un événement |
| Boutique (Shop) | Espace de vente en ligne propre à chaque artiste |
| SaaS | Logiciel hébergé centralement et accessible via abonnement |
| JWT | JSON Web Token — mécanisme stateless d'authentification |
| RBAC | Role-Based Access Control — droits basés sur les rôles |
| QR Code | Code matriciel 2D pour la validation des billets à l'entrée |
| Portfolio | Ensemble des œuvres publiées par un artiste |
| Exposition | Événement artistique organisé par un artiste |

---

*Document produit par l'Équipe YowPainter — Version 1.0 — Mars 2026*
