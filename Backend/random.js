import mongoose from "mongoose";
import Article from "./models/article.model.js";
import Disease from "./models/disease.model.js";

const MONGO_URI = "mongodb+srv://daiict:dau%40420%23@cluster0.tnpx5rz.mongodb.net/MEDICURE_DATABASE?appName=Cluster0";

const articlesData = [
  {
    title: "Skin Allergy: Causes, Symptoms, and Effective Treatment",
    description: "Skin allergy is a condition in which the immune system reacts to normally harmless substances, leading to symptoms such as itching, redness, swelling, and rashes on the skin. It can be triggered by allergens like chemicals, pollen, food, medications, or environmental factors, and its severity can vary from mild irritation to severe discomfort.",
    content: "Understanding Skin Allergy: A Complete Guide\nSkin allergy is a reaction that occurs when the immune system responds to substances that are usually harmless. These substances, known as allergens, can trigger inflammation and irritation on the skin, leading to discomfort and visible symptoms.\n\n## Types of Skin Allergies\nThere are several types of skin allergies, each with different causes and characteristics:\n- **Contact Dermatitis:** Occurs when the skin comes into direct contact with an allergen such as soaps, cosmetics, or metals.\n- **Eczema (Atopic Dermatitis):** A chronic condition that causes dry, itchy, and inflamed skin.\n- **Hives (Urticaria):** Raised, red, and itchy welts that appear suddenly due to allergic reactions.\n- **Angioedema:** Swelling beneath the skin, often around the eyes and lips.\n\n## Causes\nSkin allergies can be triggered by a variety of factors, including:\n- Chemicals in skincare products, detergents, or soaps\n- Environmental allergens such as pollen, dust, and pet dander\n- Certain foods like nuts, dairy, or seafood\n- Insect bites or stings\n- Medications such as antibiotics or pain relievers\n\n## Diagnosis\nTo diagnose a skin allergy, doctors may use several methods:\n- **Skin Prick Test:** Small amounts of allergens are applied to the skin to observe reactions\n- **Patch Test:** Used to identify substances causing delayed allergic reactions\n- **Blood Tests:** Measure immune response to specific allergens\n\n## Treatment\nTreatment depends on the severity of the allergy and may include:\n- Antihistamines to reduce itching and swelling\n- Corticosteroid creams to control inflammation\n- Moisturizers to restore the skin barrier\n- Avoidance of known allergens to prevent recurrence\n\n## Complications\nIf left untreated, skin allergies can lead to complications such as:\n- Skin infections due to scratching\n- Chronic inflammation\n- Sleep disturbances caused by itching\n\n## When to See a Doctor\nMedical attention should be sought if:\n- Symptoms persist or worsen over time\n- There is severe swelling or difficulty breathing\n- Over-the-counter treatments do not provide relief",
    symptoms: "**Common Symptoms of Skin Allergy include:**\n* Itching\n* Redness\n* Swelling\n* Rashes\n* Dry skin",
    riskFactors: "**Risk Factors include:**\n* Family history\n* Sensitive skin",
    prevention: "**Prevention Tips:**\n* Avoid allergens\n* Use mild products",
    category: "Skin Disease",
    diseaseName: "Skin Allergy"
  },
  {
    title: "Typhoid Fever: Causes, Symptoms, and Prevention",
    description: "Typhoid fever is a serious bacterial infection caused by Salmonella Typhi, primarily spread through contaminated food and water. It is characterized by prolonged high fever, weakness, abdominal pain, and digestive disturbances, and requires timely medical treatment to prevent severe complications.",
    content: "## Understanding Typhoid Fever\nTyphoid fever is a serious bacterial infection caused by Salmonella Typhi. It primarily spreads through contaminated food and water, especially in areas with poor sanitation and hygiene practices.\n\n## How It Spreads\nTyphoid spreads through the fecal-oral route. Common ways of transmission include:\n- Drinking contaminated water\n- Eating food handled by an infected person\n- Consuming improperly cooked food\n- Poor hand hygiene\n\n## Symptoms and Progression\nSymptoms usually develop gradually and may worsen over time. Early symptoms include fever and weakness, followed by digestive issues and abdominal discomfort.\n\n## Diagnosis\nDoctors use several tests to confirm typhoid fever:\n- **Blood Test:** Detects the presence of Salmonella bacteria\n- **Stool Test:** Identifies bacteria in the digestive system\n- **Widal Test:** Measures antibodies against Salmonella Typhi\n\n## Treatment\nTyphoid fever requires prompt medical treatment, including:\n- Antibiotics to eliminate the bacteria\n- Adequate hydration to prevent dehydration\n- Rest to support recovery\n- A nutritious and easily digestible diet\n\n## Complications\nIf not treated properly, typhoid can lead to serious complications such as:\n- Intestinal perforation\n- Severe dehydration\n- Internal bleeding\n- Organ failure\n\n## Prevention\nPreventive measures include:\n- Drinking safe and clean water\n- Maintaining proper hand hygiene\n- Eating well-cooked food\n- Getting vaccinated, especially before traveling to high-risk areas\n\n## When to Seek Medical Help\nImmediate medical attention is necessary if:\n- High fever persists for several days\n- There is severe abdominal pain\n- Symptoms worsen despite basic care",
    symptoms: "**Common Symptoms of Typhoid include:**\n* High fever\n* Weakness\n* Stomach pain",
    riskFactors: "**Risk Factors include:**\n* Poor sanitation\n* Contaminated water",
    prevention: "**Prevention Tips:**\n* Drink clean water\n* Maintain hygiene",
    category: "Infectious Disease",
    diseaseName: "Typhoid"
  }
];

async function seedArticles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    for (let item of articlesData) {
      // 1. Find disease by name
      const disease = await Disease.findOne({
        name: { $regex: new RegExp(`^${item.diseaseName}$`, "i") }
      });

      if (!disease) {
        console.log(`❌ Disease not found: ${item.diseaseName}`);
        continue;
      }

      // 2. Create article
      const article = new Article({
        title: item.title,
        description: item.description,
        content: item.content,
        symptoms: item.symptoms,
        riskFactors: item.riskFactors,
        prevention: item.prevention,
        category: item.category,
        disease: disease._id,
        isActive: true
      });

      await article.save();

      console.log(`✅ Article added for ${item.diseaseName}`);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedArticles();