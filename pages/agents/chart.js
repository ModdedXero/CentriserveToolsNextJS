import axios from "axios"
import Select from "../../components/select";
import SiteNavbar from "../../components/site_navbar";

export default function Chart({ sites }) {
    return (
        <div className="page-container">
            <SiteNavbar />
            <Select options={sites} />
        </div>
    )
}

export async function getServerSideProps({ params }) {
    const req = await axios.get("http://localhost:3000/api/agents/sites");

    return {
        props: { sites: req.data }
    }
}