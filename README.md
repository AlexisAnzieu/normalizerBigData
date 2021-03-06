[![Build Status](https://travis-ci.org/AlexisAnzieu/normalizerBigData.svg?branch=master)](https://travis-ci.org/AlexisAnzieu/normalizerBigData)

# normalizerBigData
Ce projet a été mené dans le but de mettre en pratique mes théories écrites dans mon mémoire de Master 2 [normalisation d'un environnement d'analyse Big Data](https://github.com/AlexisAnzieu/normalizerBigData/blob/master/normalisation%20d'un%20environnement%20d'analyse%20big%20Data.pdf)
Cet interface web permet de normer son environnement Big Data avec des bonnes pratiques universelles. 

## Installation ##

* Il est tout d'abors nécessaire d'installer nodeJS sur son poste de travail : https://nodejs.org/en/  
* Une fois cette étape réalisée, téléchargez la branche master de ce répertoire : https://codeload.github.com/AlexisAnzieu/normalizerBigData/zip/master.  
* Allez à la racine et tapez ces commandes à la suite : "npm install" puis "npm start". 
* Ouvrez maintenant votre navigateur à l'adresse suivante : http://localhost:5555

## Implémentation des fonctionnalités à venir ##

### Utilisateur ###

- [x] Modification des fichiers de configuration 

### Norme-OS ###
- [x] Existence de Java 8  
- [x] Mémoire vive disponible  
- [x] Optimisation de l'aléatoire  

### Norme-Outil ###

- [x] Arborescence des dossiers respectée  
- [ ] Vérification des liens symboliques  
- [ ] Boucle locale elasticsearch  
- [ ] Reverse proxy Kibana  
- [ ] Matrice de compatiblité  
- [ ] Snapshots  
- [ ] Backups  
- [ ] Restore / Relance
