import communityImage from "../assets/home_6.png";
import medicalImage from "../assets/home_3.jpg";
import educationImage from "../assets/OIP.webp";
import environmentImage from "../assets/home_2.jpg";
import reliefImage from "../assets/home-8.png";

const categoryImages = [
  {
    terms: ["medical", "health", "hospital", "treatment", "emergency"],
    image: medicalImage,
  },
  {
    terms: ["education", "school", "student", "children", "child"],
    image: educationImage,
  },
  {
    terms: ["environment", "clean", "water", "nature", "ocean"],
    image: environmentImage,
  },
  {
    terms: ["relief", "flood", "disaster", "food", "shelter"],
    image: reliefImage,
  },
];

export const defaultCampaignImage = communityImage;

export function getCampaignImage(campaign = {}) {
  if (campaign.image) return campaign.image;

  const searchable = [
    campaign.category,
    campaign.title,
    campaign.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    categoryImages.find(({ terms }) =>
      terms.some((term) => searchable.includes(term))
    )?.image || defaultCampaignImage
  );
}
