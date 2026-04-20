import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <div className="lpWrap">
      <header className="lpTop">
        <div className="lpBrand">
          <div className="lpMark" aria-hidden="true" />
          <div>
            <p className="lpTitle">Event Ticket Booking Platform</p>
            <p className="lpSub">Internal Department Events</p>
          </div>
        </div>

        <nav className="lpNav">
          <Link className="lpLink" to="/login">
            Login
          </Link>
          <Link className="lpBtn" to="/signup">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="lpMain">
        <section className="lpHero">
          <h1 className="lpHeroH1">Find &amp; Book Premium Events</h1>
          <p className="lpHeroP">
            College fests, tech conferences, workshops &amp; more — all in one place.
          </p>
          <div className="lpCtas">
            <Link className="lpBtn lpBtnBig" to="/events">
              View events
            </Link>
            <Link className="lpBtnGhost lpBtnBig" to="/login">
              I already have an account
            </Link>
          </div>
        </section>

        <section className="lpGrid">
          <article className="lpCard">
            <p className="lpTag">Skill Development</p>
            <h2 className="lpH2">Discover Technical Workshops</h2>
            <p className="lpP">
              Level up your skills with hands-on sessions from industry experts.
            </p>
          </article>

          <article className="lpCard">
            <p className="lpTag">Live Entertainment</p>
            <h2 className="lpH2">Experience Cultural Fests</h2>
            <p className="lpP">
              Dance, music, theater, and non-stop entertainment awaits you.
            </p>
          </article>

          <article className="lpCard">
            <p className="lpTag">Department Seminar</p>
            <h2 className="lpH2">Attend Expert Talks</h2>
            <p className="lpP">
              Seminars and guest lectures with practical insights for students &amp;
              faculty.
            </p>
          </article>
        </section>
      </main>

      <footer className="lpFooter">
        <p className="lpFootP">
          Note: Signup/Login is stored locally for this demo project.
        </p>
      </footer>
    </div>
  )
}

