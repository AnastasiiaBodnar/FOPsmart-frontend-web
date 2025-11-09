import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import How from "./sections/How";
import Features from "./sections/Features";
import Problem from "./sections/Problem";

export default function Landing(){
    return(
        <div>
            <Header />
            <Hero />
            <How />
            <Features />
            <Problem />
            <Footer/>
        </div>
    )
}