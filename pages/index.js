import axios from "axios";

import SiteNavbar from "../components/site_navbar"

export default function Home({ tag }) {
    return (
        <div className="masthead">
            <SiteNavbar />
        </div>
    )
}

export async function getStaticProps({ params }) {
    const req = await axios.get("http://localhost:3000/api/motd");

    return {
        props: { tag: req.data }
    }
}