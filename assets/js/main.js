/* ===================== CONFIGURATION GLOBALE ===================== */ // Section de configuration principale du script
const SELECTORS = { // Objet centralisé pour éviter de répéter les sélecteurs partout
  navMenu: '#nav-menu', // Sélecteur du menu latéral
  navToggle: '#nav-toggle', // Sélecteur du bouton hamburger
  navLinks: '.nav-link', // Sélecteur des liens du menu
  styleSwitcher: '#style-switcher', // Sélecteur du panneau de personnalisation
  switcherToggle: '#switcher-toggle', // Sélecteur du bouton d’ouverture du switcher
  switcherClose: '#switcher-close', // Sélecteur du bouton de fermeture du switcher
  colorButtons: '.style-switcher-color', // Sélecteur des boutons de couleur
  themeInputs: 'input[name="body-theme"]', // Sélecteur des radios light/dark
  filterButtons: '.portfolio-filter-btn', // Sélecteur des boutons de filtre portfolio
  projectCards: '.portfolio-card', // Sélecteur des cartes projets
  accordionButtons: '.resume-toggle', // Sélecteur des boutons accordéon CV
  contactForm: '#contact-form', // Sélecteur du formulaire contact
  formMessage: '#form-message', // Sélecteur du message de confirmation
}; // Fin de l’objet SELECTORS

const STORAGE_KEYS = { // Objet centralisé pour les clés localStorage
  theme: 'portfolio-theme', // Clé utilisée pour sauvegarder le thème
  hue: 'portfolio-hue', // Clé utilisée pour sauvegarder la couleur
}; // Fin de l’objet STORAGE_KEYS

/* ===================== OUTILS RÉUTILISABLES ===================== */ // Section des fonctions utilitaires
const getElement = (selector) => document.querySelector(selector); // Récupère un seul élément HTML
const getElements = (selector) => document.querySelectorAll(selector); // Récupère plusieurs éléments HTML
const saveToStorage = (key, value) => localStorage.setItem(key, value); // Sauvegarde une valeur dans localStorage
const getFromStorage = (key) => localStorage.getItem(key); // Récupère une valeur depuis localStorage

/* ===================== MENU RESPONSIVE ===================== */ // Section du menu responsive
const initMenu = () => { // Initialise le menu latéral
  const navMenu = getElement(SELECTORS.navMenu); // Récupère le menu
  const navToggle = getElement(SELECTORS.navToggle); // Récupère le bouton hamburger
  const navLinks = getElements(SELECTORS.navLinks); // Récupère tous les liens du menu

  if (!navMenu || !navToggle) return; // Stoppe la fonction si les éléments n’existent pas

  navToggle.addEventListener('click', () => { // Écoute le clic sur le hamburger
    navMenu.classList.toggle('show-menu'); // Affiche ou cache le menu
    navToggle.classList.toggle('animate-toggle'); // Anime le bouton hamburger
  }); // Fin de l’événement click

  navLinks.forEach((link) => { // Parcourt chaque lien du menu
    link.addEventListener('click', () => { // Écoute le clic sur chaque lien
      navMenu.classList.remove('show-menu'); // Ferme le menu après le clic
      navToggle.classList.remove('animate-toggle'); // Réinitialise l’animation du hamburger
    }); // Fin de l’événement click
  }); // Fin de la boucle des liens
}; // Fin de initMenu

/* ===================== STYLE SWITCHER ===================== */ // Section du style switcher
const initStyleSwitcher = () => { // Initialise le panneau de personnalisation
  const styleSwitcher = getElement(SELECTORS.styleSwitcher); // Récupère le panneau style switcher
  const switcherToggle = getElement(SELECTORS.switcherToggle); // Récupère le bouton d’ouverture
  const switcherClose = getElement(SELECTORS.switcherClose); // Récupère le bouton de fermeture

  if (!styleSwitcher || !switcherToggle || !switcherClose) return; // Stoppe si un élément manque

  switcherToggle.addEventListener('click', () => { // Écoute le clic d’ouverture
    styleSwitcher.classList.add('show-switcher'); // Affiche le panneau
  }); // Fin du clic ouverture

  switcherClose.addEventListener('click', () => { // Écoute le clic fermeture
    styleSwitcher.classList.remove('show-switcher'); // Cache le panneau
  }); // Fin du clic fermeture
}; // Fin de initStyleSwitcher

/* ===================== COULEURS DU THÈME ===================== */ // Section des couleurs dynamiques
const initThemeColors = () => { // Initialise le changement de couleur principale
  const colorButtons = getElements(SELECTORS.colorButtons); // Récupère tous les boutons couleur
  const savedHue = getFromStorage(STORAGE_KEYS.hue); // Récupère la couleur sauvegardée

  if (savedHue) document.documentElement.style.setProperty('--hue', savedHue); // Applique la couleur sauvegardée

  colorButtons.forEach((button) => { // Parcourt chaque bouton couleur
    const buttonHue = button.dataset.hue || button.style.getPropertyValue('--hue'); // Récupère la valeur hue

    if (savedHue && buttonHue === savedHue) button.classList.add('active-color'); // Active visuellement la couleur sauvegardée

    button.addEventListener('click', () => { // Écoute le clic sur une couleur
      colorButtons.forEach((item) => item.classList.remove('active-color')); // Retire l’état actif partout
      button.classList.add('active-color'); // Ajoute l’état actif au bouton cliqué
      document.documentElement.style.setProperty('--hue', buttonHue); // Modifie la variable CSS globale
      saveToStorage(STORAGE_KEYS.hue, buttonHue); // Sauvegarde la couleur choisie
    }); // Fin de l’événement couleur
  }); // Fin de la boucle couleurs
}; // Fin de initThemeColors

/* ===================== MODE LIGHT / DARK ===================== */ // Section thème clair/sombre
const initThemeMode = () => { // Initialise le thème clair/sombre
  const themeInputs = getElements(SELECTORS.themeInputs); // Récupère les boutons radio thème
  const savedTheme = getFromStorage(STORAGE_KEYS.theme) || 'light'; // Récupère le thème sauvegardé ou light

  document.body.classList.remove('light', 'dark'); // Nettoie les classes existantes
  document.body.classList.add(savedTheme); // Applique le thème sauvegardé

  themeInputs.forEach((input) => { // Parcourt chaque radio
    input.checked = input.value === savedTheme; // Coche le bon thème

    input.addEventListener('change', () => { // Écoute le changement de thème
      document.body.classList.remove('light', 'dark'); // Retire les anciens thèmes
      document.body.classList.add(input.value); // Ajoute le nouveau thème
      saveToStorage(STORAGE_KEYS.theme, input.value); // Sauvegarde le choix
    }); // Fin de l’événement change
  }); // Fin de la boucle radio
}; // Fin de initThemeMode

/* ===================== FILTRE PORTFOLIO ===================== */ // Section filtre des projets
const initPortfolioFilter = () => { // Initialise le filtre portfolio
  const filterButtons = getElements(SELECTORS.filterButtons); // Récupère les boutons de filtre
  const projectCards = getElements(SELECTORS.projectCards); // Récupère les cartes projets

  if (!filterButtons.length || !projectCards.length) return; // Stoppe si aucun élément n’existe

  filterButtons.forEach((button) => { // Parcourt chaque bouton filtre
    button.addEventListener('click', () => { // Écoute le clic filtre
      const filter = button.dataset.filter; // Récupère la catégorie choisie

      filterButtons.forEach((item) => item.classList.remove('active-filter')); // Retire l’actif partout
      button.classList.add('active-filter'); // Active le bouton cliqué

      projectCards.forEach((card) => { // Parcourt chaque carte projet
        const category = card.dataset.category; // Récupère la catégorie de la carte
        const shouldShow = filter === 'all' || filter === category; // Vérifie si la carte doit s’afficher
        card.style.display = shouldShow ? 'block' : 'none'; // Affiche ou cache la carte
      }); // Fin boucle cartes
    }); // Fin événement clic
  }); // Fin boucle filtres
}; // Fin de initPortfolioFilter

/* ===================== ACCORDÉON CV ===================== */ // Section accordéon CV
const initResumeAccordion = () => { // Initialise les accordéons du CV
  const accordionButtons = getElements(SELECTORS.accordionButtons); // Récupère les boutons accordéon

  accordionButtons.forEach((button) => { // Parcourt chaque bouton
    button.addEventListener('click', () => { // Écoute le clic accordéon
      const item = button.closest('.resume-item'); // Récupère le bloc parent
      if (!item) return; // Stoppe si le parent n’existe pas
      item.classList.toggle('is-open'); // Ouvre ou ferme le bloc
    }); // Fin événement clic
  }); // Fin boucle accordéons
}; // Fin de initResumeAccordion

/* ===================== FORMULAIRE CONTACT ===================== */ // Section formulaire contact
const initContactForm = () => { // Initialise le formulaire
  const form = getElement(SELECTORS.contactForm); // Récupère le formulaire
  const message = getElement(SELECTORS.formMessage); // Récupère le message de retour

  if (!form || !message) return; // Stoppe si le formulaire ou message manque

  form.addEventListener('submit', (event) => { // Écoute la soumission du formulaire
    event.preventDefault(); // Empêche le rechargement de la page

    const formData = new FormData(form); // Récupère les données du formulaire
    const name = formData.get('name')?.trim(); // Récupère le nom
    const email = formData.get('email')?.trim(); // Récupère l’email
    const subject = formData.get('subject')?.trim(); // Récupère le sujet
    const userMessage = formData.get('message')?.trim(); // Récupère le message utilisateur

    if (!name || !email || !subject || !userMessage) { // Vérifie les champs obligatoires
      message.textContent = 'Veuillez remplir tous les champs obligatoires.'; // Affiche une erreur
      message.classList.add('is-error'); // Ajoute le style erreur
      message.classList.remove('is-success'); // Retire le style succès
      return; // Stoppe l’envoi
    } // Fin de validation

    message.textContent = 'Message envoyé avec succès ✔'; // Affiche le succès
    message.classList.add('is-success'); // Ajoute le style succès
    message.classList.remove('is-error'); // Retire le style erreur
    form.reset(); // Vide le formulaire
  }); // Fin événement submit
}; // Fin de initContactForm

/* ===================== INITIALISATION APP ===================== */ // Section de démarrage
const initApp = () => { // Fonction principale qui lance tout
  initMenu(); // Lance le menu responsive
  initStyleSwitcher(); // Lance le style switcher
  initThemeColors(); // Lance les couleurs dynamiques
  initThemeMode(); // Lance le mode clair/sombre
  initPortfolioFilter(); // Lance le filtre portfolio
  initResumeAccordion(); // Lance les accordéons CV
  initContactForm(); // Lance le formulaire contact
}; // Fin de initApp

document.addEventListener('DOMContentLoaded', initApp); // Attend que le HTML soit chargé avant d’exécuter le JS