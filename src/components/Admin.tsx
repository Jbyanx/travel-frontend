import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

const Admin: React.FC = () => {
  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Panel de Administrador</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Eres admin</p>
      </CardContent>
    </Card>
  );
};

export default Admin;

