import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import How from "./sections/How";
import Features from "./sections/Features";

export default function Landing(){
    return(
        <div>
            <Header />
            <Hero />
            <How />
            <Features />
            <Footer/>
        </div>
    )
}