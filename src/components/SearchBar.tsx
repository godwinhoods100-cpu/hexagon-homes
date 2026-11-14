import { Search } from "lucide-react"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Field, Input, Select } from "./ui"

export function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("")
  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(
      `/listings?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`,
    )
  }
  return (
    <form className="hero-search" onSubmit={submit}>
      <Field label="I'm looking for">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="House, apartment, cottage..."
        />
      </Field>
      <Field label="Where">
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Any location</option>
          {[
            "London",
            "Brighton",
            "Manchester",
            "Bristol",
            "Edinburgh",
            "Bath",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Button type="submit">
        <Search size={18} /> Find a home
      </Button>
    </form>
  )
}
