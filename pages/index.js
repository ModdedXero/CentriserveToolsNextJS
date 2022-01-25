import axios from "axios";
import { MxCanvas, RenderBox } from "../components/built/box_3d";

import SiteNavbar from "../components/built/site_navbar"

export default function Home({ tag }) {
    return (
        <div className="page-container">
            <SiteNavbar />
            
            <div className="page-wrapper">
                <div className="motd center">
                    {tag}
                    test
                </div>
                <div className="box">
                    <MxCanvas>
                        {RenderCubes().map((cube) => {
                            return cube;
                        })}
                    </MxCanvas>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params }) {
    const req = await axios.get("http://localhost:3000/api/motd");

    return {
        props: { tag: req.data }
    }
}

// Creates and randomizes cube positions
function RenderCubes() {
    const cubes = [];
    <RenderBox position={[0, 0, 0]} />
    for (let i = 0; i < 25; i++) {
        cubes.push(<RenderBox key={getRandomNum(-10000, 10000)} 
        position={[
            getRandomNum(-5, 5),
            getRandomNum(-5, 5),
            getRandomNum(-5, 5)
        ]} />)
    }

    return cubes;
}

// Returns random number between a range
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}