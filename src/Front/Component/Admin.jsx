import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);

      navigate('/');
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

const handleDeleteUser = async (userId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log('API Response:', response.data);

    if (response.data.success) {
      fetchData();
    } else {
      console.error('Error deleting user:', response.data.error);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    navigate('/');
  }
};

  

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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminPage;
