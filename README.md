<div align="center">

# CARLOS · 30

### A little celebration, made personal.

An elegant, bilingual birthday website for a very special night in Wedel.
Built in German and Spanish, with a live wishlist and RSVP flow.

<br>

[**Open the website →**](https://carlostorrescubila.github.io/chapter-thirty/)

<br>

![Static site](https://img.shields.io/badge/site-GitHub%20Pages-24241f?style=flat-square)
![Languages](https://img.shields.io/badge/languages-DE%20%2F%20ES-b69a67?style=flat-square)
![Backend](https://img.shields.io/badge/backend-Google%20Apps%20Script-4285F4?style=flat-square)

</div>

---

## The experience

A warm, responsive invitation with the essentials up front: when to arrive, where to go, and how to RSVP. Guests can also browse the wishlist and reserve a gift. Group gifts have shared places, participant coordination, and cancellation links.

| Guest experience | What it does |
| --- | --- |
| **Two languages** | Switch between Spanish and German without losing form progress. |
| **RSVP** | Confirm attendance, add a companion, and receive a calendar link. |
| **Wishlist** | Browse available gifts and see current reservation status. |
| **Gift reservations** | Confirm by email, open the reserved gift, or cancel to release it. |
| **Group gifts** | Reserve a place, coordinate when the group fills, and manage cancellations. |

## Built with

**HTML · CSS · JavaScript · Google Apps Script · Google Sheets**

The frontend is a static GitHub Pages site. Apps Script provides the wishlist and reservation endpoints, while Google Sheets stores gifts, reservations, and attendance responses.

## Project map

```text
.
├── index.html                 # Invitation, RSVP, and wishlist interface
├── css/
│   └── styles.css             # Responsive layout and visual styling
└── js/
    └── script.js              # Translations, interactions, and API calls
```

## Publishing

### Website

GitHub Pages serves the repository from its root. Push frontend changes to the published branch and allow Pages to finish its deployment.

### Apps Script

The Apps Script backend is maintained in the local `apps-script/` folder and is intentionally excluded from this repository. Keep a local backup of the backend and deploy its changes directly from the Apps Script editor.

The deployed backend uses the `Regalos`, `Reservas`, and `Asistencia` spreadsheet tabs. Its endpoint configuration must match the published GitHub Pages URL.

---

<div align="center">

Made for one night, and everyone coming to celebrate. ♡

</div>
