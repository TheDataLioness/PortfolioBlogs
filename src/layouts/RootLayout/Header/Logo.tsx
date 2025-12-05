import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"

const Logo = () => {
  return (
    <StyledWrapper href="https://www.damyodk.com" aria-label="backtoportfolio">
      Portfolio Blogs of Damy
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)``
