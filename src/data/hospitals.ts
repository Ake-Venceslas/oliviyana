export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  profileImage?: string;
  experience: number;
}

// Fetch doctors from API
export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch("/api/doctors");
    if (!response.ok) {
      console.error("Erreur lors de la récupération des docteurs");
      return [];
    }
    const data = await response.json();
    return data.doctors || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des docteurs:", error);
    return [];
  }
}