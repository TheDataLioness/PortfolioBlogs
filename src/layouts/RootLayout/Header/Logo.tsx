import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"

const Logo = () => {
  return (
    <StyledWrapper href="https://www.damyodk.com" aria-label="backtoportfolio">
      Back to Portfolio
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)``
