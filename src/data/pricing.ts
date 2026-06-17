export const pricing = {
  basePrice: 200, // R per child
  siblingDiscount: 0.15, // each additional sibling pays (1 - 0.15) × basePrice
}

/**
 * Input: one boolean per child = "is this child a sibling of another in this booking".
 * First sibling pays full price; each subsequent sibling is discounted.
 * Non-sibling children always pay full price.
 *
 *   [true, true]        -> [200, 170]      (total 370)
 *   [true, true, true]  -> [200, 170, 170] (total 540)
 *   [true, true, false] -> [200, 170, 200] (total 570)
 *   [false, false]      -> [200, 200]      (total 400)
 */
export function priceForChildren(siblingFlags: boolean[]): number[] {
  let firstSiblingSeen = false
  return siblingFlags.map((isSibling) => {
    if (isSibling && firstSiblingSeen) {
      return Math.round(pricing.basePrice * (1 - pricing.siblingDiscount))
    }
    if (isSibling) firstSiblingSeen = true
    return pricing.basePrice
  })
}
