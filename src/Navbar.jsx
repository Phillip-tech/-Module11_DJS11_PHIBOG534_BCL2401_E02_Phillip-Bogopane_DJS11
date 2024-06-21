
export default function Navbar() {
    return (
        <nav className="nav">
            
            <a href="/" className="Site-title">Podcast Avenue</a>
            <img href="/" className="logo"  src="./public/Podcast.jpeg"/>
          
            <ul >
                <li>
                    <a href="/blogs" className="blogs">Pods</a>
                    </li>
                    <li>
                    <a href="/about" className="about">About</a>
                </li>
            </ul>
        </nav>
    )
}

