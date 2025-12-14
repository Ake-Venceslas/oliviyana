export interface Hospital {
  id: number;
  name: string;
  rating: number; // rating out of 5
  city: string;
  specialty: string;
  description: string;
  contactNumber: string;
  website?: string;
  address: string;
  imageUrl: string; // URL or path to hospital image
}

export const topHospitals: Hospital[] = [
  {
    id: 1,
    name: "Hôpital Général de Douala",
    rating: 4.7,
    city: "Douala",
    specialty: "Médecine Générale et Chirurgie",
    description: "L'un des plus grands et des mieux équipés hôpitaux de Douala, offrant un large éventail de services médicaux spécialisés.",
    contactNumber: "+237 233 425 536",
    website: "http://www.doualageneralmh.cm",
    address: "B.P. 123, Douala, Cameroun",
    imageUrl: "/douala.webp",
  },
  {
    id: 2,
    name: "Hôpital Central de Yaoundé",
    rating: 4.8,
    city: "Yaoundé",
    specialty: "Cardiologie et Oncologie",
    description: "L'hôpital principal de Yaoundé, reconnu pour ses installations avancées de cardiologie et de traitement du cancer.",
    contactNumber: "+237 222 234 567",
    website: "http://www.yaoundecentral.cm",
    address: "Avenue Kennedy, Yaoundé, Cameroun",
    imageUrl: "/yaounde.png",
  },
  {
    id: 3,
    name: "Hôpital Laquintinie Douala",
    rating: 4.6,
    city: "Douala",
    specialty: "Pédiatrie et Néonatologie",
    description: "Centre de soins pédiatriques réputé offrant des services complets pour les enfants et les nouveaux-nés.",
    contactNumber: "+237 233 425 123",
    address: "B.P. 2500, Douala, Cameroun",
    imageUrl: "/laquintinie.jpg",
  },
  {
    id: 4,
    name: "Hôpital Général de Bafoussam",
    rating: 4.5,
    city: "Bafoussam",
    specialty: "Orthéopie et Traumatologie",
    description: "Regional referral hospital serving western Cameroon with expertise in trauma and orthopedic surgeries.",
    contactNumber: "+237 233 555 789",
    address: "Quartier Nlongkak, Bafoussam, Cameroun",
    imageUrl: "/images/hospitals/bafoussam-general.jpg",
  },
  {
    id: 5,
    name: "Hôpital Régional de Bamenda",
    rating: 4.4,
    city: "Bamenda",
    specialty: "Urgences et Chirurgie Générale",
    description: "Hôpital clé pour la région du Nord-Ouest avec de puissants services d'urgence et de soins chirurgicaux.",
    contactNumber: "+237 244 321 456",
    address: "Centre-Ville de Bamenda, Cameroun",
    imageUrl: "/images/hospitals/bamenda-regional.jpg",
  },
  {
    id: 6,
    name: "Hôpital La Renaissance",
    rating: 4.3,
    city: "Yaoundé",
    specialty: "Maternité et Gynécologie",
    description: "Hôpital privé axé sur les services de maternité, gynécologie et santé des femmes.",
    contactNumber: "+237 222 345 678",
    website: "http://www.larenaissancehospital.cm",
    address: "Yaoundé, Cameroun",
    imageUrl: "/images/hospitals/la-renaissance.jpg",
  },
  {
    id: 7,
    name: "Regional Hospital Bertoua",
    rating: 4.2,
    city: "Bertoua",
    specialty: "Maladies Infectieuses et Médecine Tropicale",
    description: "Important health care provider specializing in infectious disease and tropical medicine.",
    contactNumber: "+237 255 654 321",
    address: "Bertoua, East Region, Cameroon",
    imageUrl: "/images/hospitals/bertoua-regional.jpg",
  },
  {
    id: 8,
    name: "Bonamoussadi District Hospital",
    rating: 4.1,
    city: "Douala",
    specialty: "Médecine Générale et Soins Ambulatoires",
    description: "Community hospital providing accessible general practice and outpatient services.",
    contactNumber: "+237 233 489 101",
    address: "Bonamoussadi, Douala, Cameroon",
    imageUrl: "/images/hospitals/bonamoussadi.jpg",
  },
  {
    id: 9,
    name: "Hôpital Gynéco-Obstétrique et Pédiatrique de Yaoundé",
    rating: 4.5,
    city: "Yaoundé",
    specialty: "Gynécologie, Obstétrique et Pédiatrie",
    description: "Hôpital spécialisé mettant l'accent sur la santé des femmes et des enfants avec des installations modernes.",
    contactNumber: "+237 222 654 987",
    address: "Yaoundé, Cameroun",
    imageUrl: "/images/hospitals/yaounde-gyneco.jpg",
  },
  {
    id: 10,
    name: "New Bell District Hospital",
    rating: 4.0,
    city: "Douala",
    specialty: "Services de Santé Générale",
    description: "District hospital offering essential health services to the New Bell community in Douala.",
    contactNumber: "+237 233 423 567",
    address: "New Bell, Douala, Cameroon",
    imageUrl: "/images/hospitals/new-bell.jpg",
  },
];
