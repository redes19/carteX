import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from 'axios';
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const [userData, setUserData] = useState([]);
  const { isAdmin } = useAuth();

  const token = localStorage.getItem("token");
  console.log("Token récupéré avec succès:", token);


  useEffect(() => {
    const fetchData = async () => {
      // Vérifiez si l'utilisateur est un administrateur
      if (!isAdmin) {
        // Redirigez l'utilisateur vers la page d'accueil s'il n'est pas administrateur
        return <Navigate to="/" />;
      }

      try {
        const response = await axios.get('http://localhost:3001/Utilisateur', {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        console.log("Réponse du serveur:", response.data);

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [isAdmin]); // Include isAdmin as a dependency

  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        Page Admin
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.nom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminPage;
