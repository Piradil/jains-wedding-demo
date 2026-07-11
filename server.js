const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Headless WordPress API Base Endpoint 
const WP_BASE_URL = 'https://jainswedding.great-site.net/wp-json/wp/v2';

// Modern Luxury Demo Data Fallback Engine (Runs gracefully if WordPress sends empty lists)
const DEMO_PROFILES = [
    {
        title: { rendered: "Rohan Shah" },
        acf: { profile_id: "893", sect: "Digambar", gothra: "Goyal", age: "28", height: "5'11\"", education: "M.S. Computer Science", profession: "Senior AI Engineer", diet: "Pure Vegetarian", location: "Mumbai, MH" }
    },
    {
        title: { rendered: "Pooja Jain" },
        acf: { profile_id: "742", sect: "Shvetambar", gothra: "Doshi", age: "26", height: "5'5\"", education: "MBA - IIM Ahmedabad", profession: "Investment Analyst", diet: "Jain Vegetarian (No Onion/Garlic)", location: "Delhi NCR" }
    },
    {
        title: { rendered: "Ankit Khona" },
        acf: { profile_id: "611", sect: "Shvetambar", gothra: "Chheda", age: "29", height: "6'0\"", education: "B.Tech Civil Engineering", profession: "Real Estate Developer", diet: "Pure Vegetarian", location: "Ahmedabad, GJ" }
    },
    {
        title: { rendered: "Megha Singhal" },
        acf: { profile_id: "904", sect: "Digambar", gothra: "Bansal", age: "25", height: "5'4\"", education: "Chartered Accountant (CA)", profession: "Financial Consultant", diet: "Pure Vegetarian", location: "Jaipur, RJ" }
    },
    {
        title: { rendered: "Siddharth Daga" },
        acf: { profile_id: "543", sect: "Shvetambar", gothra: "Oswal", age: "31", height: "5'9\"", education: "MD - Internal Medicine", profession: "Consulting Cardiologist", diet: "Jain Vegetarian", location: "Pune, MH" }
    },
    {
        title: { rendered: "Nisha Patni" },
        acf: { profile_id: "822", sect: "Digambar", gothra: "Kasliwal", age: "27", height: "5'6\"", education: "B.Des - NIFT", profession: "UI/UX Product Designer", diet: "Pure Vegetarian", location: "Bangalore, KA" }
    }
];

const DEMO_STORIES = [
    {
        title: { rendered: "Aman & Riya's Wedding" },
        acf: { video_embed_code: `<iframe class="w-full h-full" src="https://www.youtube.com/embed/Pj17c_VhnS0" title="Wedding Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, wedding_year: "2025" }
    },
    {
        title: { rendered: "Chirag & Khushi's Wedding" },
        acf: { video_embed_code: `<iframe class="w-full h-full" src="https://www.youtube.com/embed/5F4z_sV12yY" title="Wedding Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, wedding_year: "2024" }
    },
    {
        title: { rendered: "Darshan & Vidhi's Union" },
        acf: { video_embed_code: `<iframe class="w-full h-full" src="https://www.youtube.com/embed/5F4z_sV12yY" title="Wedding Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, wedding_year: "2026" }
    }
];

app.get('/', async (req, res) => {
    try {
        // Fetch structural datasets from backend via Axios asynchronously
        const [profilesResponse, storiesResponse] = await Promise.all([
            axios.get(`${WP_BASE_URL}/profiles?per_page=100&_embed`, { timeout: 4000 }),
            axios.get(`${WP_BASE_URL}/success-stories?per_page=3&_embed`, { timeout: 4000 })
        ]);

        // Evaluate and map active arrays
        let profilesData = Array.isArray(profilesResponse.data) ? profilesResponse.data : [];
        let storiesData = Array.isArray(storiesResponse.data) ? storiesResponse.data : [];

        // Mix in structural placeholders if WordPress data fields are clean/empty
        if (profilesData.length === 0) profilesData = DEMO_PROFILES;
        if (storiesData.length === 0) storiesData = DEMO_STORIES;

        res.render('directory', { profiles: profilesData, stories: storiesData });
    } catch (error) {
        console.warn("⚠️ WordPress API offline or slow, serving luxury demo assets directly.");
        res.render('directory', { profiles: DEMO_PROFILES, stories: DEMO_STORIES });
    }
});

app.listen(PORT, () => {
    console.log(`✨ Jain's Wedding site spinning beautifully at http://localhost:${PORT}`);
});