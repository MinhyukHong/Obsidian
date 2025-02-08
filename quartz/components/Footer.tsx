import style from "./styles/footer.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <a href="https://github.com/MinhyukHong">
          <img
            src="/static/github.png"
            width="80"
            height="80"
            style={{
              background: "transparent !important",
              border: "none !important",
              boxShadow: "none !important",
              display: "inline-block",
              padding: "0",
              margin: "0",
            }}
          />
        </a>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
