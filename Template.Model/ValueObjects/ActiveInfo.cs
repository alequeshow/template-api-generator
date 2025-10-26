
namespace Template.Model.ValueObjects
{
    public record ActiveInfo
    {
        public bool IsActive { get; private set; }

        public DateTime IsActiveFrom { get; private set; }

        public DateTime? DeactivatedSince { get; private set; }

        public ActiveInfo()
        {
            IsActive = true;
            IsActiveFrom = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            if (!IsActive)
                return;

            IsActive = false;
            DeactivatedSince = DateTime.UtcNow;
        }

        public void Reactivate()
        {
            if (IsActive)
                return;

            IsActive = true;
            IsActiveFrom = DateTime.UtcNow;
            DeactivatedSince = null;
        }
    }
}
