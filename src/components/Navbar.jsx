const Navbar = () => {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand" href="/">Viakaran</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link" href="/help">Help<span className="sr-only"></span></a>
        </div>
        <div className="navbar-nav ms-auto">
          <a className="nav-item nav-link" href="/bob">Admin<span className="sr-only"></span></a>
        </div>
      </div>
  </nav>
    )
  }

export default Navbar