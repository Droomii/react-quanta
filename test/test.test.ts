describe("Testing Test", () => {
  test("Test with success", () => {
    expect("test").toEqual("test")
  })
  test("Test with fail", () => {
    expect("test").not.toEqual("not Test")
  })
})
