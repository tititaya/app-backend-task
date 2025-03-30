require('dotenv').config(); // Chargement des variables d'environnement
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const server = express();

// Configuration de la base de données avec les variables d'environnement
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root123",
    database: process.env.DB_NAME || "gestion_tasks",
});

// Middleware
server.use(express.json());
server.use(cors());

// Route pour enregistrer une tâche
server.post("/register", (req, res) => {
    const { name, description, priorite } = req.body;

    if (!name || !description || !priorite) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const sql = "INSERT INTO tasks (name, description, priorite) VALUES (?, ?, ?)";
    db.query(sql, [name, description, priorite], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion :", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
        res.status(200).json({ message: "Tâche enregistrée avec succès !" });
    });
});

// Route pour obtenir toutes les tâches
server.get("/tasks", (req, res) => {
    const sql = "SELECT * FROM tasks";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération :", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
        res.status(200).json(result);
    });
});

// Route pour obtenir le résumé des tâches
server.get("/tasks-summary", (req, res) => {
    const sql = `
        SELECT 
            statut, 
            COUNT(*) AS total 
        FROM tasks 
        GROUP BY statut
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des totaux :", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
        res.status(200).json(result);
    });
});

// Route pour modifier une tâche
server.put("/edit", (req, res) => {
    const { id, name, description, priorite, statut } = req.body;

    if (!id || !name || !description || !priorite || !statut) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const sql = "UPDATE tasks SET name = ?, description = ?, priorite = ?, statut = ? WHERE idtasks = ?";
    db.query(sql, [name, description, priorite, statut, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour :", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
        res.status(200).json({ message: "Tâche mise à jour avec succès !" });
    });
});

// Route pour supprimer une tâche
server.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID de la tâche requis." });
    }

    const sql = "DELETE FROM tasks WHERE idtasks = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression :", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
        res.status(200).json({ message: "Tâche supprimée avec succès !" });
    });
});

// Gestion des routes inexistantes
server.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée." });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}`);
});
