namespace Template.Model.ValueObjects
{
    public record PersonName
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }

        public PersonName(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }
    }
}