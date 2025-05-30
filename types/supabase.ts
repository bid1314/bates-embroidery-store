export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: number
          title: string
          created_at?: string
        }
        Insert: {
          id?: number
          title: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          created_at?: string
        }
      }
    }
  }
}
