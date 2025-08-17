import { Container, Typography } from "@mui/material";


export default function LoadingState() {
    return <div>
         <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Loading...
      </Typography>
        </Container>
    </div>
}